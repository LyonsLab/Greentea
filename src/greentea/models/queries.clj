(ns greentea.models.queries
  (:use [korma.core]
        [greentea.db]))

(defn coge-user-list []
"This is to test json output from the coge db"
  (str
    (select log
      (fields :user_id)
      (group :user_id))))

(defn coge-comment-list []
"This is to test json output from the coge db"
  (str
    (select log
      (fields :comment)
      (where
        (not= :comment "nil")))))
