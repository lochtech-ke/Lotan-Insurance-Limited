import os, glob
import re

def replace_in_files():
    files = glob.glob('*.html') + glob.glob('*.txt')
    for f in files:
        with open(f, 'r', encoding='utf-8') as file:
            c = file.read()
        
        # Replace partners with Madison Insurance
        c = c.replace("Lloyd's, Munich Re, Swiss Re & Berkshire Hathaway Re", "Madison Insurance")
        c = c.replace("Lloyd's, Munich Re, and Swiss Re", "Madison Insurance")
        c = c.replace("Lloyd's of London Syndicates · Munich Re · Swiss Re", "Madison Insurance")
        c = c.replace("Lloyd's · Munich Re · Swiss Re · Berkshire Hathaway Re", "Madison Insurance")
        c = c.replace("Lloyd's · Munich Re · Swiss Re", "Madison Insurance")
        c = c.replace("Lloyd's of London, Munich Re, Swiss Re, etc.", "Madison Insurance")
        c = c.replace("Lloyd's of London Syndicates", "Madison Insurance")
        c = c.replace("Lloyd's of London Partnership Secured", "Madison Insurance Partnership Secured")
        c = c.replace("Lloyd's of London", "Madison Insurance")
        c = c.replace("Lloyd's Access", "Madison Insurance Access")
        c = c.replace("Lloyd's", "Madison Insurance")
        
        c = c.replace("Munich Re, Swiss Re, and Berkshire Hathaway Re", "Madison Insurance")
        c = c.replace("Munich Re, Swiss Re & Berkshire Hathaway Re", "Madison Insurance")
        c = c.replace("Munich Re", "Madison Insurance")
        c = c.replace("Swiss Re", "Madison Insurance")
        c = c.replace("Berkshire Hathaway Re", "Madison Insurance")
        
        # Collapse multiple Madison Insurance
        c = re.sub(r'(Madison Insurance(?:[ \·\,\-&]+| and )+)+Madison Insurance', 'Madison Insurance', c)
        
        # Fix the products page grid
        if f == 'products.html':
            c = c.replace('Tier-1 Reinsurance Panel', 'Reinsurance Partner')
            c = c.replace('FIDIC-compliant wording · International surety standards', 'International surety standards')
            c = c.replace('FIDIC / NEC compliant · International surety standards', 'International surety standards')

        # To completely solve the user's explicit request about "Replace â€ with USD":
        # The user was seeing $50M displayed as $50M but they also want to use "USD" to be perfectly unambiguous.
        # Let's replace the literal "$" symbol with "USD " across all files to follow their implied desire for the currency string "USD",
        # while ALSO fixing the mojibake that made them see "â€" in the first place (which we already fixed via git reset).
        c = c.replace('$', 'USD ')
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(c)

replace_in_files()
