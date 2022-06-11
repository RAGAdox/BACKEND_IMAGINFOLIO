insert into activity (type,parent_id,username,active) 
(select 
'LIKED',
p.post_id,
fr.follower_id ,
TRUE
from 
	posts p
inner join 
	follow_relations fr 
on fr.followee_id =p.username 
order by random()
limit 500
);

insert into activity (type,parent_id,username,active) 
(select 
'COMMENTED',
p.post_id,
fr.follower_id ,
TRUE
from 
	posts p
inner join 
	follow_relations fr 
on fr.followee_id =p.username 
order by random()
limit 100
);