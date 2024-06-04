import os
import shutil
import zipfile
import sys

def extract_audio_sdoc(file_path, output_folder):
    print("Processing .sdoc file...")
    if zipfile.is_zipfile(file_path):
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            temp_dir = os.path.join(output_folder, "temp")
            zip_ref.extractall(temp_dir)
            print(f"Extracted all contents to temporary directory: {temp_dir}")
            
            # Search for .m4a files in the extracted contents
            for root, dirs, files in os.walk(temp_dir):
                for file in files:
                    if file.endswith('.m4a'):
                        source_file_path = os.path.join(root, file)
                        audio_filename = os.path.join(output_folder, file)
                        shutil.copy(source_file_path, audio_filename)
                        print(f"Extracted audio to: {audio_filename}")
            shutil.rmtree(temp_dir)
            print(f"Cleaned up temporary directory: {temp_dir}")
    else:
        print("The file is not a ZIP archive.")

def main():
    if len(sys.argv) != 3:
        print("Usage: convert.py {folder_input} {output_folder}")
        sys.exit(1)

    input_folder = sys.argv[1]
    output_folder = sys.argv[2]
    output_folder_path = os.path.join(os.getcwd(), output_folder)
    if not os.path.exists(output_folder_path):
        os.makedirs(output_folder_path)
    print(f"Output will be saved in: {output_folder_path}")

    files_processed = 0
    for file in os.listdir(input_folder):
        file_path = os.path.join(input_folder, file)
        print(f"Checking file: {file}")
        if file.endswith('.sdoc'):
            extract_audio_sdoc(file_path, output_folder_path)
            files_processed += 1

    print(f"Total files processed: {files_processed}")

if __name__ == "__main__":
    main()