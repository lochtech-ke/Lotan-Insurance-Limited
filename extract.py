import sys
try:
    import pypdf
    with open('extracted_text.txt', 'w', encoding='utf-8') as f:
        f.write('--- Company Profile ---\n')
        pdf1 = pypdf.PdfReader('.context/Lotan Insurance Company Profile.pdf')
        for page in pdf1.pages:
            f.write(page.extract_text() + '\n')
            
        f.write('\n\n--- Value Proposition ---\n')
        pdf2 = pypdf.PdfReader('.context/Lotan\'s Value Proposition.pdf')
        for page in pdf2.pages:
            f.write(page.extract_text() + '\n')
    print("Extraction successful")
except Exception as e:
    with open('extracted_text.txt', 'w', encoding='utf-8') as f:
        f.write(f'Error: {type(e).__name__}: {str(e)}')
    print(f"Extraction failed: {type(e).__name__}: {str(e)}")
