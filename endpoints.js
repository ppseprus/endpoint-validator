(function() {
	'use strict';

	var yup = require('yup');

	module.exports = [
		{
			alias: 'GithubAPI for Endpoint Validator',
			interval: '10s',
			requestOptions: {
				url: 'https://api.github.com/repos/ppseprus/endpoint-validator',
				headers: {
					// NOTE:
					// https requests need the following header
					'User-Agent': 'request'
				}
			},
			expectations: [
				{
					// UNABLE TO CONNECT
					statusCode: 0
				}, {
					// SUCCESS
					statusCode: 200,
					schema: yup.object().shape({

						id: yup.number()
							.positive().integer().required(),
						name: yup.string()
							.required(),
						private: yup.boolean()
							.required(),

						// NOTE:
						// with the above few keys, .required() is used
						// it is not needed below, because
						// .noUnknown(true) is used on the container object
						owner: yup.object().noUnknown(true).shape({
							login: yup.string(),
							id: yup.number()
								.positive().integer(),
							avatar_url: yup.string()
								.url(),
							gravatar_id: yup.string(),
							url: yup.string()
								.url(),
							html_url: yup.string()
								.url(),
							followers_url: yup.string()
								.url(),
							following_url: yup.string(),
								//.url(), // invalid url https://api.github.com/users/ppseprus/following{/other_user}
							gists_url: yup.string(),
								//.url(), // invalid url https://api.github.com/users/ppseprus/gists{/gist_id}
							starred_url: yup.string(),
								//.url(), // invalid url https://api.github.com/users/ppseprus/starred{/owner}{/repo}
							subscriptions_url: yup.string()
								.url(),
							organizations_url: yup.string()
								.url(),
							repos_url: yup.string()
								.url(),
							events_url: yup.string(),
								//.url(), // invalid url https://api.github.com/users/ppseprus/events{/privacy}
							received_events_url: yup.string()
								.url(),
							type: yup.string(),
							site_admin: yup.boolean()
						})

					})
				}
			]
		}
	];

})();