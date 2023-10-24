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

	var title = el('h1', ['class="ui inverted header"'], el('div', ['class="content"'], config.title + el('div', ['class="sub header"'], config.subtitle)));
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
	var input = el('div', ['class="ui left corner labeled right icon fluid large input"'], el('div', ['class="ui left corner label"'], el('img', ['id="search-fav"', 'class="left floated avatar ui image"', 'src="data:image/jpeg;base64,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"'], "")) + el('input', ['id="searchinput"', 'type="search"', 'placeholder="搜索你想要知道的……"', 'autocomplete="off"'], "") + el('i', ['class="inverted circular search link icon"'], ""));
	return el('header', [], el('div', ['id="head"', 'class="ui inverted vertical masthead center aligned segment"'], "" + el('div', ['id="title"', 'class="ui text container"'], title + (config.search ? input + menu : "") + `${config.selling_ads ? '<div><a id="menubtn" class="red ui icon inverted button"><i class="heart icon"></i> 喜欢此域名 </a></div>' : ''}`)))
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
		<script src="https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js"></script>
		<link href="https://cdn.jsdelivr.net/npm/semantic-ui-css@2.4.1/semantic.min.css" rel="stylesheet">
		<link href="https://cdn.jsdelivr.net/gh/sleepwood/cf-worker-dir@0.1.1/style.css" rel="stylesheet">
		<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/semantic-ui-css@2.4.1/semantic.min.js"></script>
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
