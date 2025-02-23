from flask import Flask,request,jsonify
from flask_cors import CORS
import pickle
import torch
import numpy as np
from utils import *
app=Flask(__name__)

# Enable CORS
CORS(app,resources={r"/*": {"origins": "http://localhost:3000"}})

# define mean pooling function
def mean_pool(token_embeds, attention_mask):
    # reshape attention_mask to cover 768-dimension embeddings
    in_mask = attention_mask.unsqueeze(-1).expand(
        token_embeds.size()
    ).float()
    # perform mean-pooling but exclude padding tokens (specified by in_mask)
    pool = torch.sum(token_embeds * in_mask, 1) / torch.clamp(
        in_mask.sum(1), min=1e-9
    )
    return pool

def predict_nli_class_with_similarity(model, premise, hypothesis, tokenizer, device):
    # Tokenize and convert to input IDs and attention masks
    classifier_head = torch.nn.Linear(768*3, 3).to(device)
    inputs_a = tokenizer(premise, return_tensors='pt', truncation=True, padding=True).to(device)
    inputs_b = tokenizer(hypothesis, return_tensors='pt', truncation=True, padding=True).to(device)
    
    inputs_ids_a = inputs_a['input_ids']
    attention_a = inputs_a['attention_mask']
    inputs_ids_b = inputs_b['input_ids']
    attention_b = inputs_b['attention_mask']
    
    segment_ids_a = torch.zeros_like(inputs_ids_a).to(device)
    segment_ids_b = torch.zeros_like(inputs_ids_b).to(device)
    
    # Get BERT embeddings
    with torch.no_grad():
        u_last_hidden_state = model.get_last_hidden_state(inputs_ids_a, segment_ids_a).to(device)
        v_last_hidden_state = model.get_last_hidden_state(inputs_ids_b, segment_ids_b).to(device)
    
    # Mean-pooling
    u_mean_pool = mean_pool(u_last_hidden_state, attention_a).detach().cpu().numpy()
    v_mean_pool = mean_pool(v_last_hidden_state, attention_b).detach().cpu().numpy()
    
    # Create the feature vector for classification
    uv_abs = torch.abs(torch.sub(torch.tensor(u_mean_pool).to(device), torch.tensor(v_mean_pool).to(device)))
    x = torch.cat([torch.tensor(u_mean_pool).to(device), torch.tensor(v_mean_pool).to(device), uv_abs], dim=-1)
    
    # Get logits from the classifier head
    logits = classifier_head(x)
    
    # Compute class probabilities
    probs = F.softmax(logits, dim=-1)
    
    # Map probabilities to classes
    class_labels = ['contradiction', 'neutral', 'entailment']
    predicted_class = class_labels[torch.argmax(probs).item()]
    
    return {
        'predicted_class': predicted_class,
        'class_probabilities': probs.detach().cpu().numpy(),
    }

    
def get_device():
    return torch.device('cuda' if torch.cuda.is_available() else 'cpu')


# Load the model
with open('./model/model.pkl', 'rb') as f:
    model = torch.load(f, weights_only=False)
    
# Load the classifier head
with open('./model/classifier_head.pkl', 'rb') as f:
    classifier_head = torch.load(f, weights_only=False)

# Load the tokenizer
with open('./model/tokenizer.pkl', 'rb') as f:
    tokenizer = torch.load(f, weights_only=False)

@app.route('/infer', methods=['GET'])
def infer():
    try:
        premise =  request.args.get('premise') 
        hypothesis =  request.args.get('hypothesis') 
        result = predict_nli_class_with_similarity(model, premise, hypothesis, tokenizer, get_device())
        return jsonify({"result":{"predicted_class":result['predicted_class'],"class_probabilities":result['class_probabilities'].tolist()}})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/', methods=['GET'])
def call():
    return jsonify({'Name':"Suryansh Srivastava", 'ID':124997,'proglib':'NLP Assignment 4'})
if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5000)