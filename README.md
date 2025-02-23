# InferX

This project is a web application that performs Natural Language Inference (NLI) using a fine-tuned BERT model. The frontend is built with React, while the backend is powered by Flask. The model takes a premise and a hypothesis as input and returns class probabilities for three categories: contradiction, neutral, and entailment, along with the predicted class.

<hr>

## 🎥 **App Demo**
![image](https://github.com/user-attachments/assets/f11c143a-5db3-434b-9545-441d3e401b35)
_Screenshot of the InferX Web App Interface_

<hr>

## 🚀 **Features**

- 🖥️ **Frontend:** A React-based UI where users enter a premise and hypothesis for inference.<br>

- 🧠 **Backend:** A Flask-based API that processes the input, loads a fine-tuned BERT model, and generates class probabilities.<br>

- 📖 **Model:** Pre-trained BERT model fine-tuned on the MNLI dataset.<br>

<hr>

The structure is organized as follows:

```
AIT-NLP-Assignment4/
│── app/
│   ├── client/   # React frontend
│   │   ├── public/
│   │   ├── src/
│   │
│   ├── server/   # Flask backend
│   │   ├── models/   # Stores trained BERT model, classifier head and tokenizer
│   │   ├── app.py
│   │   ├── utils.py
│   │   ├── requirements.txt
│
│── notebooks/
│   ├── BERT-update.ipynb  # Notebook for training BERT model
│   ├── S-Bert.ipynb  # Notebook for training BERT model
│
│── README.md
```

<hr>

## 🛠️ How It Works

### Frontend (React)

- The user enters:
  - A premise
  - A hypothesis
- The input is sent as query parameters to the Flask backend (/infer endpoint).
- The model's inference results are displayed on the website.

### Backend (Flask)

- The Flask server receives the request at /infer with:
  - `premise` → The premise sentence.
  - `hypothesis` → The hypothesis sentence.
- The server loads:
  - bert_model.pkl (Fine-tuned BERT model)
  - tokenizer.pkl (BERT Tokenizer)
  - classifier_head.pkl
- The inference function:
  - Tokenizes and encodes the premise and hypothesis.
  - Feeds them into the BERT model.
  - Computes the probability distribution over the three classes: contradiction, neutral, and entailment.
  - Returns the predicted class and probabilities.
- The predicted class and probabilities are returned as JSON to the frontend.

<hr>

### Application Endpoints

- **Frontend (React app):** Runs on http://localhost:3000
- **Backend (Flask API):** Runs on http://localhost:5000

### API Endpoints

#### **`GET /`**- Returns author information.

#### **`GET /infer`** - Takes a premise and hypothesis, passes them to the model for inference, and returns the class probabilities and predicted class.

- Description: Performs natural language inference on the input premise and hypothesis.
- Parameters:
  - `premise` (string) → Premise sentence.
  - `hypothesis` (string) → Hypothesis sentence.
- Example Request:
  ```
  curl "http://localhost:5000/infer?premise=The sky is blue.&hypothesis=The sky is clear."
  ```
- Response Format:
  ```
  {
    "predicted_class": "neutral",
    "class_probabilities": [0.05,0.60,0.35],
  }
  ```

## Installation and Setup

### Clone the Repository (Using Git LFS)

Since the repository contains large model files, you need to install Git LFS before cloning:

1. Install Git LFS (if not installed):

```

git lfs install

```

2. Clone the repository:

```

git clone https://github.com/Suryansh2204/AIT-NLP-Assignment4.git
cd AIT-NLP-Assignment4

```

## Setup and Running the Application

### Install Backend Dependencies

```

cd server
pip install -r requirements.txt

```

### Install Frontend Dependencies

```

cd client
npm install

```

### Run the Flask Backend

```

cd server
python app.py

```

### Run the React Frontend

```

cd client
npm start

```

- Open http://localhost:3000/ in your browser.
