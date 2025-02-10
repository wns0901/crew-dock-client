export const useGetNickname = (userInfo) => {
    const getNicknameById = (userId) => {
        return userInfo.id === userId ? userInfo.nickname : null;
    };
    return getNicknameById;
}