import axios from 'axios';


export const getAdminDashboardInfoAPI = () => {
  return (axios.get('/api/admin/admin_dashboard_info'));
};

export const createForumAPI = (forum_obj) => {
  const formData = new FormData();

  for (let attr in forum_obj) {
    if (attr === 'tileObject')
      formData.append(attr, JSON.stringify(forum_obj[attr]))
    else
      formData.append(attr, forum_obj[attr])
  }


  return (axios.post('/api/admin/create_forum', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }));
};

export const deleteForumAPI = (forum_id) => {
  return (axios.post('/api/admin/delete_forum', { forum_id }));
};
