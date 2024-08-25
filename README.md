# Samsung Notes Audio Extractor

Easily extract audio files from Samsung Notes (.sdoc) and convert them to .m4a with our free online tool. Fast and secure.

## Features

- **Supported Formats**: SDOC, SDOCX (from Samsung Notes)
- **Output Formats**: .m4a (audio files)
- **Compatibility**: Works on all major browsers, including Chrome, Firefox, Safari, and Edge. Optimized for both desktop and mobile use.

## Usage

To use the converter, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/samsung-notes-audio-extractor.git
    cd samsung-notes-audio-extractor
    ```

2. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

3. Run the converter script:
    ```sh
    python convert.py {input_folder} {output_folder}
    ```

    - `{input_folder}`: The folder containing your .sdoc or .sdocx files.
    - `{output_folder}`: The folder where the extracted .m4a files will be saved.

## How It Works

1. **Upload your Samsung Notes file (.sdoc or .sdocx)** by clicking the "Select Files" button on the web interface.
2. **Our tool scans the document** for embedded audio files, which are often hidden within the notes.
3. **Download the extracted audio files** in .m4a format, packaged neatly in a ZIP file for your convenience.

## Example

### Web Interface

The web interface allows you to easily upload and convert your Samsung Notes files. The interface includes:

- A file input section where you can select your .sdoc or .sdocx files.
- A list of selected files with options to remove individual files.
- A convert button to start the extraction process.
- A result section where you can download the extracted audio files.

### Code Example

Here's a brief overview of the main components:

- **HTML**: The structure of the web interface is defined in `index.html`.
- **CSS**: The styling is managed in `style.css`, ensuring a clean and responsive design.
- **JavaScript**: The functionality is implemented in `script.js`, handling file selection, conversion, and download.

### Sample Code Snippet

#### HTML (index.html)