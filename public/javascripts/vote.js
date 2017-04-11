//把方法封装在此对象里
//取首页数据的偏移量
let offset = 0;
let limit = 10;
let total = 0;
//当前浏览器URL中的路径
let url = window.location.href;
let indexReg = /\/vote\/index/;//首页的正则
let registerReg = /\/vote\/register/;//注册页报名页的正则
let detailReg=/\/vote\/detail/;
let searchReg=/\/vote\/search/;
const USER_KEY = 'user';
let voteFn = {
    //把用户数组转成li字符串
    formatUsers(users){
        //把对象数组转成li数组
        return users.map(user => (
            `
                    <li>        
                        <div class="head">
                           <a href="/vote/detail/${user.id}">
                              <img src="${user.head_icon}" alt="">
                           </a>
                        </div>
                        <div class="up">
                           <div class="vote">
                              <span>${user.vote}票</span>
                           </div>
                           <div class="btn" data-id="${user.id}">
                              投TA一票
                           </div>
                        </div>
                        <div class="descr">
                           <a href="/vote/detail/${user.id}">
                             <div>
                                <span>${user.username}</span>
                                <span>|</span>
                                <span>编号#${user.id}</span>
                              </div>
                              <p>${user.description}</p>
                           </a>
                        </div>     
                    </li>
                `
        )).join('');//最后拼接成一个大的字符串
    },
    detailUsers(user){
        return `<div class="pl">
					<div class="head">
						<img src="${user.head_icon}" alt="">
					</div>
					<div class="p_descr">
						<p>${user.username}</p>
						<p>编号#${user.id}</p>
					</div>
				</div>
				<div class="pr">
					<div class="p_descr pr_descr">
						<p>${user.rank}名</p>
						<p>${user.vote}票</p>
					</div>
				</div>
				<div class="motto">
					${user.description}
				</div>`
    },
    detailFriends(friends){
       return friends.map((user)=>{
           return `<li>
				    <div class="head">
				        <a href="#"><img src="${user.head_icon}" alt=""></a>
				    </div>
				    <div class="up">
				    	<div class="vote">
				    		<span>投了一票</span>
				    	</div>
				    </div>
				    <div class="descr">
				        <h3>${user.username}</h3>
				        <p>编号#${user.id}</p>
				    </div>
				</li>	`
       }).toString();
    },
    //向服务器发起ajax请求
    request({url, type = 'GET', data = {}, dataType = 'json', success}){
        $.ajax({url, type, data, dataType, success})
    },
    //初始化首页数据
    initIndexData(){
        //向服务器发起请求首页的用户列表
        voteFn.request({
            url: `/vote/index/data?limit=${limit}&offset=${offset}`,
            success(result){
                //最新的偏移量应该加等于limit
                offset += limit;
                //总条数
                total = result.data.total;
                let users = result.data.objects;
                let html = voteFn.formatUsers(users);
                $('.coming').html(html);
            }
        });
        loadMore({
            //当拉到底部的时候会执行callback
            callback: function (load) {
                if (offset >= total) {
                    load.complete();
                    /*延时是为了更好的演示效果*/
                    setTimeout(function () {
                        load.reset();
                    }, 1000)
                } else {//如果偏移量小于最大条数，则需要继续加载
                    voteFn.request({
                        url: `/vote/index/data?limit=${limit}&offset=${offset}`,
                        success(result){
                            //最新的偏移量应该加等于limit
                            offset += limit;
                            let users = result.data.objects;
                            let html = voteFn.formatUsers(users);
                            setTimeout(function () {
                                $('.coming').append(html);
                                load.reset();
                            }, 1000)
                        }
                    });
                }
            }
        });
        let user = voteFn.getStorage(USER_KEY);
        user = JSON.parse(user);
        if(user){
            $('.register a').text('个人主页');
            $('.username').text(user.username);
            $('.no_signed').hide();
            $('.register a').attr('href','/vote/detail/'+user.id);
        }
        // 退出登录
        $('.dropout').click(function(){
            voteFn.clearStorage(USER_KEY);
            location.reload();
        });
        $('.mask').click(function(event){
            if(event.target.className == 'mask')
                $(this).hide();
        });
        $('.sign_in').click(function () {
            $('.mask').show();
        });
        $('.coming').on('click','.btn',function(event){
            let curEle=$(event.target);
            let user=voteFn.getUser(USER_KEY);
            if(user){
                let id=curEle.data('id');
                let voterId=user.id;
                voteFn.request({
                    url:`/vote/index/poll?id=${id}&voterId=${voterId}`,
                    success(res){
                       alert(res.msg);
                        if(res.errno==0){
                            let voteEle=curEle.siblings('.vote').children('span')
                            let oldVote=parseInt(voteEle.text().replace(' ',''));
                            voteEle.html(`${oldVote+1}票`)
                        }
                    }
                })
            }else{
                $('.mask').show()
            }
        });
        $('.subbtn').click(function(){
            let id = $('.usernum').val();
            let password = $('.user_password').val();
            if(!id || !password){
                alert('用户名或密码不能为空');
                return;
            }
            voteFn.request({
                url:'/vote/index/info',
                type:'POST',
                data:{id,password},
                success(result){
                    console.log(result);
                    if(result.errno==0){
                        voteFn.setStorage(USER_KEY,JSON.stringify(result.user));
                        location.reload();
                    }else{
                        alert(result.msg);
                    }
                }
            })
        });
        $('.search span').click(function(){
            let search=$('.search input').val()
            voteFn.setStorage('SEARCH',search);
            location='/vote/search'
        })
    },
    getUser(key){
        return voteFn.getStorage(key)?JSON.parse(voteFn.getStorage(key)):null;
    },
    setStorage(key,value){
        localStorage.setItem(key,value);
    },
    getStorage(key){
        return localStorage.getItem(key);
    },
    clearStorage(key){
        localStorage.removeItem(key);
    },
    //初始化报名页
    initRegister(){
        $('.rebtn').click(function () {
            let username = $('.username').val();
            if(!username){
                alert('用户名不能为空');
                return;
            }
            let initial_password = $('.initial_password').val();
            let confirm_password = $('.confirm_password').val();
            if(!initial_password || !confirm_password || initial_password!=confirm_password|| !/^[0-9a-zA-Z]{1,10}$/.test(initial_password)){
                alert('密码不合法');
                return;
            }
            let mobile = $('.mobile').val();
            if(!mobile || !/^1\d{10}$/.test(mobile)){
                alert('手机号不正确');
                return;
            }
            let description = $('.description').val();
            if(!description || description.length>20){
                alert('自我描述不正确');
                return;
            }
            let gender = $('input[name="name"]:checked').val();
            let user = {username,
                password:initial_password,
                mobile,
                description,
                gender
            }
            voteFn.request({
                url:'/vote/register/data',
                type:'POST',
                data:user,
                success(result){
                    if(result.errno == 0){
                        alert(result.msg);
                        user.id = result.id;
                        voteFn.setStorage(USER_KEY,JSON.stringify(user));
                        location = '/vote/index';
                    }
                }
            })
        });
    },
    //
    initDetail(){
        let reg=/\/vote\/detail\/(\d+)/;
        let res=url.match(reg);
        let id=res[1];
        voteFn.request({
            url:`/vote/all/detail/data?id=${id}`,
            success(data){
                let res=data.data;
                $('.personal').html(voteFn.detailUsers(res))
                console.log(voteFn.detailFriends(res.vfriend));
                $('.vflist').html(voteFn.detailFriends(res.vfriend))
            }
        })
    },
    initSearch(){
        let search=voteFn.getStorage('SEARCH');
        voteFn.request({
            url:`vote/index/search?content=${search}`,
            success(res){
                if(res.data){
                    $('.coming').html(voteFn.formatUsers(res.data))
                }else{
                    $('.no-result').show()
                }
                //console.log(res)
            }
        });
        $('.coming').on('click','.btn',function(event){
            let curEle=$(event.target);
            let user=voteFn.getUser(USER_KEY);
            if(user){
                let id=curEle.data('id');
                let voterId=user.id;
                voteFn.request({
                    url:`/vote/index/poll?id=${id}&voterId=${voterId}`,
                    success(res){
                        alert(res.msg);
                        if(res.errno==0){
                            let voteEle=curEle.siblings('.vote').children('span')
                            let oldVote=parseInt(voteEle.text().replace(' ',''));
                            voteEle.html(`${oldVote+1}票`)
                        }
                    }
                })
            }else{
                $('.mask').show()
            }
        });
    }
}
$(function () {
    //如果是首页
    if(indexReg.test(url)){
        voteFn.initIndexData();
        //则当前是报名页
    }else if(registerReg.test(url)){
        voteFn.initRegister();
    }else if(detailReg.test(url)){
        voteFn.initDetail();
    }else if(searchReg.test(url)){
        voteFn.initSearch();
    }
})