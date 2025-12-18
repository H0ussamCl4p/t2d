"""
Analysis Service - Preserves FormationAnalyzer logic from main.py
"""
import pandas as pd
import numpy as np
import re
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans


class AnalysisService:
    """
    Service for analyzing formation evaluation data.
    Preserves the original FormationAnalyzer logic.
    """
    
    def __init__(self):
        # These models are ready for future clustering step
        self.vectorizer = TfidfVectorizer(max_features=100, stop_words=['le', 'la', 'de'])
        self.kmeans = KMeans(n_clusters=3, random_state=42)
        
    def analyze_sentiment(self, text):
        """Analyse de sentiment basée sur des règles métiers (dictionnaires)"""
        if pd.isna(text) or str(text).strip() == '':
            return 'neutre'
        
        text_lower = str(text).lower()
        
        # Mots-clés positifs spécifiques au contexte formation
        positive_words = [
            'utile', 'excellent', 'super', 'bon', 'bien', 'parfait', 'intéressant',
            'compétent', 'clair', 'opérationnel', 'adapté', 'structuré', 'pratique',
            'applicable', 'satisfait', 'génial', 'formidable', 'efficace', 'pertinent'
        ]
        
        # Mots-clés négatifs
        negative_words = [
            'théorique', 'difficile', 'mauvais', 'nul', 'déçu', 'incompris',
            'trop rapide', 'court', 'général', 'manque', 'moyen', 'faible',
            'problème', 'compliqué', 'confus', 'superficiel', 'insuffisant'
        ]
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return 'positif'
        elif negative_count > positive_count:
            return 'négatif'
        else:
            return 'neutre'
    
    def extract_keywords(self, texts, n_keywords=10):
        all_text = ' '.join([str(t) for t in texts if pd.notna(t)])
        words = re.findall(r'\b\w+\b', all_text.lower())
        stopwords = ['le', 'la', 'les', 'de', 'des', 'du', 'et', 'est', 'dans', 'pour',
                     'sur', 'avec', 'pas', 'mais', 'très', 'trop', 'plus', 'bien', 'bon',
                     'formation', 'formateur', 'contenu', 'logistique', 'applicabilité', 'une', 'un']
        
        filtered_words = [w for w in words if w not in stopwords and len(w) > 3 and not w.isdigit()]
        word_counts = Counter(filtered_words)
        return [word for word, count in word_counts.most_common(n_keywords)]
    
    def calculate_statistics(self, df):
        stats = {}
        numeric_cols = ['satisfaction', 'contenu', 'logistique', 'applicabilite']
        for col in numeric_cols:
            if col in df.columns:
                stats[f'{col}_mean'] = df[col].mean()
        return stats
    
    def generate_insights(self, df):
        insights = []
        # Insight 1 : Formations en difficulté
        if 'type_formation' in df.columns and 'satisfaction' in df.columns:
            formation_stats = df.groupby('type_formation')['satisfaction'].mean().reset_index()
            for _, row in formation_stats.iterrows():
                if row['satisfaction'] < 3.0:
                    insights.append(f"⚠️ ATTENTION : La formation '{row['type_formation']}' a une satisfaction faible ({row['satisfaction']:.2f}/5)")
                elif row['satisfaction'] >= 4.5:
                    insights.append(f"✅ SUCCÈS : La formation '{row['type_formation']}' excelle ({row['satisfaction']:.2f}/5)")
        return insights
    
    def analyze(self, df):
        """
        Main analysis method - preserves original FormationAnalyzer.analyze() logic
        """
        results = {
            'scores_moyens': {},
            'sentiments': {},
            'keywords': [],
            'insights': []
        }
        
        # 1. Scores
        for col in ['satisfaction', 'contenu', 'logistique', 'applicabilite']:
            if col in df.columns:
                results['scores_moyens'][col] = float(df[col].mean())
        
        # 2. Sentiments
        if 'commentaire' in df.columns:
            df['sentiment_calcule'] = df['commentaire'].apply(self.analyze_sentiment)
            results['sentiments'] = df['sentiment_calcule'].value_counts().to_dict()
            results['keywords'] = self.extract_keywords(df['commentaire'])
            
        # 3. Insights
        results['insights'] = self.generate_insights(df)
        
        return results, df

