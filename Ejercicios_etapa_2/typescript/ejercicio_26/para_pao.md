1. Change to use relative paths
2. use new URL(PATH, import.meta.url).pathname with relative paths
2. Move files into folders
2. Change MotoDePlantillas to account for the new folder structure
3. Create files and directtories if these don't exist
4. Change logic from ziping the whole folder, to zipping individual files
5. Include information in the form data with the file name and folder name
6. update the controller so we are getting that information from the watcher
