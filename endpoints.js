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

						owner: yup.object().noUnknown(true).shape({
							login: yup.string().required(),
							id: yup.number()
								.positive().integer().required(),
							avatar_url: yup.string()
								.url().required(),
							gravatar_id: yup.string(),
							url: yup.string()
								.url().required(),
							html_url: yup.string()
								.url().required(),
							followers_url: yup.string()
								.url().required(),
							following_url: yup.string().required(),
								//.url(), // invalid url https://api.github.com/users/ppseprus/following{/other_user}
							gists_url: yup.string().required(),
								//.url(), // invalid url https://api.github.com/users/ppseprus/gists{/gist_id}
							starred_url: yup.string().required(),
								//.url(), // invalid url https://api.github.com/users/ppseprus/starred{/owner}{/repo}
							subscriptions_url: yup.string()
								.url().required(),
							organizations_url: yup.string()
								.url().required(),
							repos_url: yup.string()
								.url().required(),
							events_url: yup.string().required(),
								//.url(), // invalid url https://api.github.com/users/ppseprus/events{/privacy}
							received_events_url: yup.string()
								.url().required(),
							type: yup.string().required(),
							site_admin: yup.boolean().required()
						})

					})
				}
			]
		}
	];

})();