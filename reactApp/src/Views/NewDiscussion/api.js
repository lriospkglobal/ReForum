import axios from 'axios';

export const postDiscussionApi = (discussion) => {
  const formData = new FormData();
  for (let attr in discussion) {
    formData.append(attr, discussion[attr]);

  }


  return (axios.post('/api/discussion/newDiscussion', formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }));
};
