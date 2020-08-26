import axios from 'axios';


export const getAdminDashboardInfoAPI = () => {
  return (axios.get('/api/admin/admin_dashboard_info'));
};

export const createForumAPI = (forum_obj) => {
  const formData = new FormData();
  
  formData.append('img', forum_obj.mosaicImage);
  formData.append('title', forum_obj.title);
  formData.append('slug', forum_obj.slug);

  return (axios.post('/api/admin/create_forum', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }));
};

export const deleteForumAPI = (forum_id) => {
  return (axios.post('/api/admin/delete_forum', { forum_id }));
};
