const cacheKeys = {
  companyById: (id) => `companies:id:${id}`,
  userById: (id) => `users:id:${id}`,
  applicationById: (id) => `applications:id:${id}`,
  applicationsByUserId: (userId) => `applications:user:${userId}`,
  applicationsByJobId: (jobId) => `applications:job:${jobId}`,
  bookmarksByUserId: (userId) => `bookmarks:user:${userId}`,
};

export default cacheKeys;
