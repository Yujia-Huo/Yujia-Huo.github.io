function Parsed(d){
    
    if(d.likes>1000000){
    return{
        "video_id": d.video_id,
        "title": d.title,
        "date":d.trending_date,
        "category": d.category, 
        "view_count": +d.view_count,
        "comment_count": +d.comment_count,
        "likes": +d.likes,
        "dislikes": +d.dislikes

    }
}

    
}
d3.csv("./data/YoutubeTrendingVideos-ARTG5430.csv",Parsed).then(function(data){
    console.log(data);
})