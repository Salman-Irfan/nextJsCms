const endPoints = {
	GET_PAGE_NAMES: "/pages/page-names",
	GET_PAGE_CONTENT: "/pages/",
	POST_CONTACT_US: "/contact-us",
	POST_JOIN_US: "/join-us",
	ADMIN_LOGIN_FORM: "/admin/auth/login",
	FETCH_ALL_LISTS: "/lists/fetch-all-lists",
	FETCH_ALL_LISTS_BY_CATEGORY_ID: '/lists/category',
	FETCH_ALL_CONTACT_US_BY_ADMIN: '/admin/contact-us/fetch-all-contact-us',
	FETCH_ALL_JOIN_US_BY_ADMIN: '/admin/join-us/fetch-all-join-us',
	// new
	// admin lists
	ADD_LIST: '/admin/lists/add-list',
	UPLOAD_GALLERY_PICTURES: '/admin/lists/add-list/add-gallery-pictures',
	ADD_VIDEO_URLS: '/admin/lists/add-list/add-video-urls',
	ADMIN_DELETE_LISTING: '/admin/lists/delete',
};

export default endPoints