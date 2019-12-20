/* eslint-disable sort-keys */
export const FILE_STATUS = {
  UPLOADING: 'UPLOADING', // 1. File is being uploaded
  PROCESSING: 'PROCESSING', // 2. File is being processed
  PREVIEW: 'PREVIEW_GENERATION', // 3. Preview is being generated for that file
  READY: 'READY', // 4. File is ready for view / download
  DELETED: 'DELETED', // 5. File is deleted
};

export const STORAGE_PATHS = {
  buildingCover: (buildingId, fileName) => `buildings/${buildingId}/covers/${fileName}`,
  file: (buildingId, fileId) => `buildings/${buildingId}/files/${fileId}`,
  user: {
    photo: (userId) => `users/${userId}/profile`,
    root: (userId) => `users/${userId}`,
  },
};
