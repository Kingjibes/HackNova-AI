export const handleFileUpload = (file, fileType) => {
  return new Promise((resolve) => {
    const fileName = file.name;
    const type = file.type;
    const fileSize = (file.size / 1024).toFixed(2) + ' KB';

    let fileInfoMessageContent = `File selected: ${fileName} (${type}, ${fileSize}).`;
    
    if (fileType === 'image' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imagePreview = `<img  src="${e.target.result}" alt="${fileName}" class="max-w-xs max-h-xs rounded-md my-2" src="https://images.unsplash.com/photo-1697256200022-f61abccad430" />`;
        resolve(`${fileInfoMessageContent}\n${imagePreview}\n(File content processing is not yet implemented in this demo.)`);
      };
      reader.onerror = () => {
        resolve(`${fileInfoMessageContent}\n(Could not generate image preview. File content processing is not yet implemented in this demo.)`);
      };
      reader.readAsDataURL(file);
    } else {
      resolve(`${fileInfoMessageContent}\n(File content processing is not yet implemented in this demo.)`);
    }
  });
};