import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import numpy as np
import json

#load dataset 
df = pd.read_csv("spam.csv", encoding="latin-1")
df = df[['v1', 'v2']]
df.columns = ['label', 'message']

df['label'] = df['label'].map({'ham': 0, 'spam': 1})
#split dataset into features and labels

#convert text -> bag of words
vectoriser = CountVectorizer(stop_words='english')
X = vectoriser.fit_transform(df['message'])
y = df['label']

#train logistic regression
model = LogisticRegression(max_iter=1000)
model.fit(X, y)

#get weights and bias
W = model.coef_[0]
b = model.intercept_[0]

print(f"Weights: {W}")
print(f"Bias: {b}")
print(f"Vocabulary: {vectoriser.get_feature_names_out()}")

data = {
    "weights": W.tolist(),
    "bias": b,
    "vocabulary": vectoriser.get_feature_names_out().tolist()
}

with open("model.json", "w") as f:
    json.dump(data, f)

