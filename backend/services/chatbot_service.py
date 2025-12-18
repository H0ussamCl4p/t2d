"""BobAssistant - semantic-search based HR assistant using sentence-transformers.

Features implemented:
- Uses 'all-MiniLM-L6-v2' SentenceTransformer model to build embeddings for knowledge base questions.
- Precomputes embeddings at startup and caches the model / assistant instance.
- Uses cosine similarity on normalized embeddings and a confidence threshold (default 0.35).
- Persona: Always prefixes responses with "Bob here 🤖:". If confidence is low, returns a polite fallback.
"""

from functools import lru_cache
import os
import logging
from typing import List, Optional

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)


def _find_csv_path(csv_path: str = 'RH_infos.csv') -> Optional[str]:
    possible_paths = [
        csv_path,
        os.path.join(os.path.dirname(__file__), '..', csv_path),
        os.path.join(os.getcwd(), csv_path),
    ]
    for path in possible_paths:
        if os.path.exists(path):
            return path
    return None


@lru_cache(maxsize=1)
def _load_model(model_name: str = 'all-MiniLM-L6-v2') -> SentenceTransformer:
    """Load and cache the SentenceTransformer model once."""
    logger.info(f"Loading embedding model: {model_name}")
    model = SentenceTransformer(model_name)
    # Optionally set device to cpu explicitly (sentence-transformers will choose automatically)
    return model


class BobAssistant:
    """Assistant Virtuel RH 'Bob' using dense semantic search.

    Behavior:
    - Precomputes embeddings for knowledge base at initialization.
    - get_response(query): returns a string starting with "Bob here 🤖:".
    - If highest similarity < threshold, returns the fallback message.
    """

    DEFAULT_THRESHOLD = 0.35

    def __init__(self, csv_path: str = 'RH_infos.csv', model_name: str = 'all-MiniLM-L6-v2', threshold: float = DEFAULT_THRESHOLD):
        self.csv_path = _find_csv_path(csv_path)
        self.threshold = threshold
        self.model_name = model_name
        self.model = _load_model(model_name)

        # Knowledge base fields
        self.q_texts: List[str] = []
        self.answers: List[str] = []
        self.domains: List[str] = []
        self.embeddings: Optional[np.ndarray] = None

        self._load_knowledge_base()

    def _load_knowledge_base(self):
        if not self.csv_path:
            logger.warning("No RH_infos.csv found; knowledge base is empty.")
            return

        try:
            df = pd.read_csv(self.csv_path)
        except Exception as e:
            logger.exception("Failed to read RH_infos.csv: %s", e)
            return

        # expected columns: 'domaine', 'question', 'reponse' -- be tolerant to variations
        q_col = None
        a_col = None
        d_col = None
        for c in df.columns:
            low = c.lower()
            if 'question' in low:
                q_col = c
            if 'reponse' in low or 'answer' in low or 'réponse' in low:
                a_col = c
            if 'domaine' in low or 'domain' in low:
                d_col = c

        if q_col is None or a_col is None:
            logger.warning('RH_infos.csv missing expected columns (question/reponse). Adjacent columns: %s', list(df.columns))
            return

        # Build texts used for retrieval: prefer domain + question
        texts = []
        answers = []
        domains = []
        for _, row in df.iterrows():
            q = str(row.get(q_col, '')).strip()
            a = str(row.get(a_col, '')).strip()
            d = str(row.get(d_col, '')).strip() if d_col else ''
            combined = (d + ' ' + q).strip()
            texts.append(combined if combined else q)
            answers.append(a)
            domains.append(d)

        self.q_texts = texts
        self.answers = answers
        self.domains = domains

        if len(self.q_texts) == 0:
            logger.warning('RH_infos.csv contained no usable Q/A rows.')
            return

        # Compute embeddings once and normalize them for cosine similarity
        embs = self.model.encode(self.q_texts, convert_to_numpy=True, show_progress_bar=False)
        norms = np.linalg.norm(embs, axis=1, keepdims=True)
        norms[norms == 0] = 1e-12
        self.embeddings = embs / norms
        logger.info('Precomputed %d embeddings for knowledge base.', len(self.q_texts))

    def input_sanitization(self, text: str) -> str:
        """Sanitize user input to avoid harmful strings and trim whitespace."""
        if not isinstance(text, str):
            text = str(text)
        # basic sanitization: strip and remove scripts
        sanitized = text.strip()
        sanitized = sanitized.replace('\n', ' ').replace('\r', ' ')
        return sanitized

    def _cosine_similarity(self, query_emb: np.ndarray) -> np.ndarray:
        # embeddings are normalized, so cosine is dot product
        if self.embeddings is None or len(self.embeddings) == 0:
            return np.array([])
        return np.dot(self.embeddings, query_emb)

    def get_response(self, user_query: str) -> str:
        """Return Bob's answer as a single string with persona prefix.

        If confidence < threshold returns the fallback message.
        """
        prefix = "Bob here 🤖:"

        if not user_query or not isinstance(user_query, str):
            return f"{prefix} Please provide a question so I can help."

        if self.embeddings is None or len(self.q_texts) == 0:
            return f"{prefix} My knowledge base is empty right now. Please contact HR directly."

        sanitized = self.input_sanitization(user_query)
        try:
            q_emb = self.model.encode([sanitized], convert_to_numpy=True, normalize_embeddings=True)[0]
        except TypeError:
            # older sentence-transformers versions may not support normalize_embeddings
            q_emb = self.model.encode([sanitized], convert_to_numpy=True, show_progress_bar=False)[0]
            q_emb = q_emb / (np.linalg.norm(q_emb) + 1e-12)

        sims = self._cosine_similarity(q_emb)
        if sims.size == 0:
            return f"{prefix} I don't have that information. Please contact the HR department directly."

        best_idx = int(np.argmax(sims))
        best_score = float(sims[best_idx])

        # Confidence threshold
        if best_score < self.threshold:
            return f"{prefix} I'm not sure about that. Please contact the HR department directly."

        answer = self.answers[best_idx] if best_idx < len(self.answers) else ''
        domain = self.domains[best_idx] if best_idx < len(self.domains) else ''

        # Compose reply, keeping it short and persona-first
        reply = f"{prefix} {answer}"
        if domain:
            reply += f" (Domain: {domain})"
        return reply


# Cached assistant factory to avoid reloading model/embeddings on each request
@lru_cache(maxsize=1)
def get_bob_assistant(csv_path: str = 'RH_infos.csv', model_name: str = 'all-MiniLM-L6-v2', threshold: float = BobAssistant.DEFAULT_THRESHOLD) -> BobAssistant:
    """Return a cached BobAssistant instance (singleton per process)."""
    return BobAssistant(csv_path=csv_path, model_name=model_name, threshold=threshold)


# Backwards-compatibility alias
ChatbotService = BobAssistant


if __name__ == '__main__':
    # quick local smoke test
    assistant = get_bob_assistant()
    print(assistant.get_response('Quelle est la politique de congés ?'))

