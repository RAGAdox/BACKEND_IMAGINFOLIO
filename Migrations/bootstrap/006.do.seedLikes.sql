insert into likes (parent_id,count)
(select a.parent_id,count(a.username)  from activity a where a.type='LIKED'::ACTIVITY_TYPE and a.active=true group by a.parent_id);