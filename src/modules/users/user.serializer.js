const serializeUserSummary = (user) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phoneNumber: user.phone_number,
  };
};

const serializeUserDetail = (user) => {
  return {
    ...serializeUserSummary(user),
    bio: user.bio,
    profilePictureUrl: user.profile_picture_url,
    createdAt: user.created_at,
  };
};

export { serializeUserDetail, serializeUserSummary };
