import re
import math
from collections import Counter
import os

# Ensure the file path is correct relative to the backend
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAQ_FILE = os.path.join(BASE_DIR, 'lotan_faq.txt')

# Load the text and split into paragraphs/chunks
try:
    with open(FAQ_FILE, 'r', encoding='utf-8') as f:
        text = f.read()
        # Sanitize stylized dots/commas inside words (e.g. I.4ura.ce -> Insurance)
        # We'll replace the common dot/comma misplacements based on the script patterns
        text = text.replace('I.4ura.ce', 'Insurance')
        text = text.replace('Li,ited', 'Limited')
        text = text.replace('Rei.4ura.ce', 'Reinsurance')
        text = text.replace('Propo4itio.', 'Proposition')
        text = text.replace('Mi44io.', 'Mission')
        text = text.replace('Vi4io.', 'Vision')
        text = text.replace('Adva.tage', 'Advantage')
        text = text.replace('Product4', 'Products')
        text = text.replace('Solutio.4', 'Solutions')
        text = text.replace('Bo.d4', 'Bonds')
        text = text.replace('Bo.d', 'Bond')
        text = text.replace('Pay,e.t', 'Payment')
        text = text.replace('Guara.tee4', 'Guarantees')
        text = text.replace('Guara.tee', 'Guarantee')
        text = text.replace('Part.er4&ip4', 'Partnerships')
        text = text.replace('Part.er4&ip', 'Partnership')
        text = text.replace('Co,,it,e.t', 'Commitment')
        text = text.replace('Excelle.ce', 'Excellence')
        text = text.replace('Stre.gt&4', 'Strengths')
        text = text.replace('Co,pre&e.4ive', 'Comprehensive')
        text = text.replace('Protectio.', 'Protection')
        text = text.replace('I.tegrity', 'Integrity')
        text = text.replace('Clie.t-Ce.tricity', 'Client-Centricity')
        text = text.replace('Profe44io.ali4,', 'Professionalism')
        text = text.replace('I.4ig&t', 'Insight')
        text = text.replace('Fi.a.cial', 'Financial')
        text = text.replace('Sta.dard4', 'Standards')
        text = text.replace('Partie4', 'Parties')
        text = text.replace('Le.der', 'Lender')
        text = text.replace('Borrower', 'Borrower')
        text = text.replace('Activa.t', 'Activant')
        text = text.replace('Pre,iu,', 'Premium')
        text = text.replace('Ad,i.i4trative', 'Administrative')
        text = text.replace('Co4t4', 'Costs')
        text = text.replace('Taxe4', 'Taxes')
        text = text.replace('Settle,e.t', 'Settlement')
        
        # General backup: remove any dots/commas between letters
        text = re.sub(r'([a-zA-Z])[\.,]([a-zA-Z])', r'\1\2', text)
except FileNotFoundError:
    text = ""

# Chunk by double newlines or specific logical breaks.
# We will clean up the text and split it into readable chunks.
raw_chunks = re.split(r'\n\s*\n', text)
chunks = []
current_chunk = ""
for c in raw_chunks:
    c = c.strip()
    if not c:
        continue
    # If the chunk is too small, append it to the current chunk
    if len(c.split()) < 10:
        current_chunk += " " + c
    else:
        if current_chunk:
            chunks.append(current_chunk.strip())
        current_chunk = c
if current_chunk:
    chunks.append(current_chunk.strip())

# Precompute TF-IDF
def tokenize(text):
    return re.findall(r'\b[a-z]{3,}\b', text.lower())

N = len(chunks)
df = Counter()
for chunk in chunks:
    tokens = set(tokenize(chunk))
    for t in tokens:
        df[t] += 1

def compute_idf(word):
    return math.log((N + 1) / (df.get(word, 0) + 1)) + 1

def generate_response(query):
    query_tokens = set(tokenize(query))
    if not query_tokens:
        return "How can I help you today?"
    
    best_chunk = "I couldn't find a precise answer to that in our documentation. Please feel free to use our 'Talk To Us' form to speak directly with one of our financial architects."
    best_score = 0
    
    for chunk in chunks:
        tokens = tokenize(chunk)
        if not tokens:
            continue
        tf = Counter(tokens)
        
        score = 0
        for qt in query_tokens:
            if qt in tf:
                # Term Frequency: frequency of term in document
                # Inverse Document Frequency: rarity of term across all documents
                score += (tf[qt] / len(tokens)) * compute_idf(qt)
                
        # Boost score if chunk contains exact phrase
        if query.lower() in chunk.lower():
            score += 2.0
            
        if score > best_score:
            best_score = score
            best_chunk = chunk
            
    # Moderate threshold so it doesn't give random irrelevant text
    if best_score < 0.05: 
        return "I'm sorry, I couldn't find specific details regarding that in our documentation. Please contact our team directly for more information."
        
    return best_chunk
