# miniParamOne
微信小程序实战，数据获取one一个。
还请根据提供的数据接口自行去获取数据，代码中就不要在使用写好的地址了。
数据接口：
首页：date是日期，传入不同的日期获取对应的数据
http://v3.wufazhuce.com:8000/api/channel/one/".date."/杭州市

one-story,阅读,专栏分类的详情数据：id是对应的点击的item的id
http://v3.wufazhuce.com:8000/api/essay/$id?version=v3.5.3

问答：
http://v3.wufazhuce.com:8000/api/question/$id?version=v3.5.3

连载：
http://v3.wufazhuce.com:8000/api/serialcontent/$id?version=v3.5.3

电影：
http://v3.wufazhuce.com:8000/api/movie/$id/story/1/0?version=v3.5.3
电影故事情节介绍：
http://v3.wufazhuce.com:8000/api/movie/detail/$id?version=v3.5.3

评论通用：word是对应的分类 essay,question,serial,movie,music  cid是评论的id，第一次传0，加载获取更多评论时，cid是上面获取到评论的最后一条评论的id
http://v3.wufazhuce.com:8000/api/comment/praiseandtime/$word/$id/$cid?version=v3.5.3
