import os
import zipfile

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.join(base_dir, '..')
    zip_path = os.path.join(root_dir, 'lotan-risk-advisor.zip')
    
    # List of runtime files to package (relpath_in_extension_dir, relpath_in_zip)
    files_to_zip = [
        ('manifest.json', 'manifest.json'),
        ('popup.html', 'popup.html'),
        ('popup.css', 'popup.css'),
        ('popup.js', 'popup.js'),
        ('faq-data.js', 'faq-data.js'),
        ('icons/icon16.png', 'icons/icon16.png'),
        ('icons/icon48.png', 'icons/icon48.png'),
        ('icons/icon128.png', 'icons/icon128.png'),
    ]
    
    print("Packaging Lotan Risk Advisor extension...")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for local_name, arc_name in files_to_zip:
            full_path = os.path.join(base_dir, local_name)
            if os.path.exists(full_path):
                zip_file.write(full_path, arc_name)
                print(f"  + {arc_name}")
            else:
                print(f"  ! Warning: {local_name} not found! Skipping...")
                
    print(f"\nSuccessfully packaged extension. Distribution file ready at:\n{os.path.abspath(zip_path)}")

if __name__ == '__main__':
    main()
