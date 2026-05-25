import os
import re
import json

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    faq_file = os.path.join(base_dir, '..', 'lotan_faq.txt')
    output_file = os.path.join(base_dir, 'faq-data.js')

    if not os.path.exists(faq_file):
        print(f"Error: {faq_file} not found.")
        return

    with open(faq_file, 'r', encoding='utf-8') as f:
        text = f.read()

    # Apply the same cleanups as chatbot.py
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
    
    text = re.sub(r'([a-zA-Z])[\.,]([a-zA-Z])', r'\1\2', text)

    # Split into blocks
    blocks = re.split(r'\n\s*\n', text)
    faq_list = []
    
    current_q = None
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        
        # Check if this block is a Q/A pair or separate lines
        lines = block.split('\n')
        q_line = None
        a_line = []
        
        for line in lines:
            line_str = line.strip()
            if line_str.startswith('Q:'):
                if current_q and a_line:
                    faq_list.append({
                        "q": current_q,
                        "a": "\n".join(a_line).strip()
                    })
                current_q = line_str[2:].strip()
                a_line = []
            elif line_str.startswith('A:'):
                a_line.append(line_str[2:].strip())
            else:
                if current_q:
                    a_line.append(line_str)
        
        if current_q and a_line:
            faq_list.append({
                "q": current_q,
                "a": "\n".join(a_line).strip()
            })
            current_q = None
            a_line = []

    # Format as JavaScript global declaration
    js_content = f"// Lotan Insurance FAQ Database (Auto-generated)\nconst FAQ_DATA = {json.dumps(faq_list, indent=2)};\n"
    
    with open(output_file, 'w', encoding='utf-8') as out_f:
        out_f.write(js_content)
        
    print(f"Successfully generated FAQ database with {len(faq_list)} Q&A pairs at {output_file}")

if __name__ == '__main__':
    main()
