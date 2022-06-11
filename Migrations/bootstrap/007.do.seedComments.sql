insert into "comments" (parent_id,comment_text)
(select a.parent_id,'this is a coment' as comment_text from activity a where a.type='COMMENTED'::ACTIVITY_TYPE and a.active=true);
