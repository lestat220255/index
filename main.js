import lists from './sites.json'
import search_engine from './search_engines.json'

/**
	* 自定义网站配置 
	*/
const config = {
	title: "网站收藏夹", //write your website title
	subtitle: "一些还不错的网站", //write your website subtitle
	logo_icon: "keyboard outline", //select your logo by semantic-ui icon (you can get more msg in:https://semantic-ui.com/elements/icon.html)
	search: true, //enable search function
	search_engine,
	selling_ads: false, //Selling your domain or not.(turning on may be helpful for selling this domain by showing some ads.)
	// sell_info: {
	// domain: "example.com",
	// price: 500, //domain price
	// mon_unit: "yen sign", //monetary unit 
	// contact: [ //how to contact you
	// {
	// type: "envelope", //contact type ("weixin","qq","telegram plane","envelope" or "phone")
	// content: "info@example.com"
	// }
	// ]
	// },
	lists
}
let isCN = false;
let weather = '';
const el = (tag, attrs, content) => `<${tag} ${attrs.join(" ")}>${content}</${tag}>`;

export default {
	async fetch(request, env) {
		const { pathname } = new URL(request.url);
    // weather = await renderWeather(request);

		if (pathname === "/api/test" && request.method === 'POST') {
			// If you did not use `DB` as your binding name, change it here
			const { results } = await env.DB.prepare(
				"SELECT * FROM user WHERE email = ?"
			)
				.bind("lestat9527@gmail.com")
				.all();
			return Response.json(results);
		}
		const init = {
			headers: {
				'content-type': 'text/html;charset=UTF-8',
			},
		}

		isCN = request.cf.country === 'CN';
		return new Response(renderHTML(renderIndex(), config.selling_ads ? renderSeller() : null), init);
	},
};

/*通过分析链接 实时获取favicon
* @url 需要分析的Url地址
*/
function getFavicon(url) {
	if (url.match(/https{0,1}:\/\//)) {
		if (isCN) {
			return "https://ui-avatars.com/api/?bold=true&size=36&background=0D8ABC&color=fff&rounded=true&name=" + url.split('//')[1];
		}
		return "https://www.google.com/s2/favicons?sz=64&domain_url=" + url;
	} else {
		if (isCN) {
			return "https://ui-avatars.com/api/?bold=true&size=36&background=0D8ABC&color=fff&rounded=true&name=" + url;
		}
		return "https://www.google.com/s2/favicons?sz=64&domain_url=http://" + url;
	}
}

/** Render Functions
	* 渲染模块函数
	*/
function renderIndex() {
	return renderTips() + renderHeader() + renderMain();
}

function renderTips(){
	if(isCN){
		//return el('div', ['class="text-center text-pink-500 font-bold text-3xl"'], `由于当前网络受限，仅展示基础页面`);
	}
	return '';
}

function renderHeader() {
	const item = (template, name) => el('a', ['class="item"', `data-url="${template}"`], name);

	var title = el('h1', ['class="flex justify-center"'], el('div', ['class="text-3xl text-white font-bold"'], config.title + el('div', ['class="text-xl py-2"'], config.subtitle)));
	var search_engine = config.search_engine.filter((item) => {
		return !(item.hasOwnProperty('unavailableForCN') && item.unavailableForCN === false && isCN)
	});
	var menu = el('div', ['id="sengine"', 'class="ui bottom attached tabular inverted secondary menu"'], el('div', ['class="header item"'], '&nbsp;') + search_engine.map((link, key) => {
		if (key == 0) {
			return el('a', ['class="active item"', `data-url="${link.template}"`], link.name);
		} else {
			return item(link.template, link.name);
		}
	}).join(""))
	var input = el('div', ['class="ui left corner labeled right icon fluid large input"'], el('div', ['class="ui left corner label"'], el('img', ['id="search-fav"', 'class="left floated avatar ui image"'], "")) + el('input', ['id="searchinput"', 'type="search"', 'placeholder="搜索你想要知道的……"', 'autocomplete="off"'], "") + el('i', ['class="inverted circular search link icon"'], ""));
	return el('header', [], el('div', ['class="flex justify-center overflow-hiddenflex flex-row bg-gradient-to-b from-slate-800 to-gray-500 py-12"'], "" + el('div', ['class="mx-auto w-96 md:w-3/5 max-w-4xl"'], title + (config.search ? input + menu : "") + `${config.selling_ads ? '<div><a id="menubtn" class="red ui icon inverted button"><i class="heart icon"></i> 喜欢此域名 </a></div>' : ''}`)))
}

function renderMain() {
	var main = config.lists.map((item) => {
		const card = (url, name, desc) => el('a', ['class="card"', `href=${url}`, 'target="_blank"'], el('div', ['class="content"'], el('img', ['class="left floated avatar ui image"', `src=${getFavicon(url)}`, `async`], "") + el('div', ['class="header"'], name) + el('div', ['class="meta"'], desc)));
		const divider = el('h4', ['class="ui horizontal divider header"'], el('i', [`class="${item.icon} icon"`], "") + item.name);

		var content = el('div', ['class="ui four stackable cards"'], item.list.map((link) => {
			if (link.hasOwnProperty('unavailableForCN') && link.unavailableForCN === true && isCN) {
				return null;
			}
			return card(link.url, link.name, link.desc);
		}).join(""));

		return el('div', ['class="ui basic segment"'], divider + content);
	}).join("");

	return el('main', [], el('div', ['class="ui container"'], main));
}

function renderSeller() {
	const item = (type, content) => el('div', ['class="item"'], el('i', [`class="${type} icon"`], "") + el('div', ['class="content"'], content));
	var title = el('h1', ['class="ui yellow dividing header"'], el('i', ['class="gem outline icon"'], "") + el('div', ['class="content"'], config.sell_info.domain + ' 正在出售'));
	var action = el('div', ['class="actions"'], el('div', ['class="ui basic cancel inverted button"'], el('i', ['class="reply icon"'], "") + '返回'));

	var contact = config.sell_info.contact.map((list) => {
		return item(list.type, list.content);
	}).join("");
	var column = el('div', ['class="column"'], el('h3', ['class="ui center aligned icon inverted header"'], el('i', ['class="circular envelope open outline grey inverted icon"'], "") + '联系我') + el('div', ['class="ui relaxed celled large list"'], contact));
	var price = el('div', ['class="column"'], el('div', ['class="ui large yellow statistic"'], el('div', ['class="value"'], el('i', [`class="${config.sell_info.mon_unit} icon"`], "") + config.sell_info.price)));
	var content = el('div', ['class="content"'], el('div', ['class="ui basic segment"'], el('div', ['class="ui two column stackable center aligned grid"'], el('div', ['class="ui inverted vertical divider"'], '感兴趣？') + el('div', ['class="middle aligned row"'], price + column))));

	return el('div', ['id="seller"', 'class="ui basic modal"'], title + content + action);
}

function renderHTML(index, seller) {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>${config.title} - ${config.subtitle}</title>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css">
		<link href="https://cdn.jsdelivr.net/npm/semantic-ui-css@2.4.1/semantic.min.css" rel="stylesheet">
		<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
		<script src="https://cdn.tailwindcss.com"></script>
	</head>
	<body>
		${index}
		${config.selling_ads ? seller : ''}
		<script>
			$('#sengine a').on('click', function (e) {
				$('#sengine a.active').toggleClass('active');
				$(e.target).toggleClass('active');
				$('#search-fav').attr('src',$(e.target).data('url').match(`+ /https{0,1}:\/\/\S+\// + `)[0] + '/favicon.ico') ;
			});
			$('.search').on('click', function (e) {
				var url = $('#sengine a.active').data('url');
				url = url.replace(`+ /\$s/ + `,$('#searchinput').val());
				window.open(url);
			});
			/* 鼠标聚焦时，回车事件 */
			$("#searchinput").bind("keypress", function(){
				if (event.keyCode == 13){
				// 触发需要调用的方法
				$(".search").click();
				}
			});
			$('#menubtn').on('click', function (e) {
				$('#seller').modal('show');
			});
		</script>
	</body>
	</html>`
}

async function renderWeather(request){
	let endpoint = "https://api.waqi.info/feed/geo:";
		const token = "20efc75df76cf06426674d27f98490175f3715ee"; //Use a token from https://aqicn.org/api/

		const latitude = request.cf.latitude;
		const longitude = request.cf.longitude;
		endpoint += `${latitude};${longitude}/?token=${token}`;
		const init = {
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		};

		const response = await fetch(endpoint, init);
		const content = await response.json();

		let weather_content = '<div class="text-center font-bold text-xl mb-2">天气信息</div>';
		weather_content += `<p class="text-gray-700 text-base">经纬度: ${latitude},${longitude}.</p>`;
		weather_content += `<p class="text-gray-700 text-base">位置 <a href="${content.data.city.url}">${content.data.city.name}</a>:</p>`;
		weather_content += `<p class="text-gray-700 text-base">AQI等级: ${content.data.aqi}.</p>`;
		weather_content += `<p class="text-gray-700 text-base">N02等级: ${content.data.iaqi.no2?.v}.</p>`;
		weather_content += `<p class="text-gray-700 text-base">O3等级: ${content.data.iaqi.o3?.v}.</p>`;
		weather_content += `<p class="text-gray-700 text-base">当前温度: ${content.data.iaqi.t?.v}°C.</p>`;

	return el('div', ['class="lg:absolute top-1/4 left-4 max-w-md rounded shadow-lg"'], el('div', ['class="px-6 py-4"'], weather_content));
}
