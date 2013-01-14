(ns greentea.models.endpoints
  (:require [noir.response :as nr]
            [greentea.models.queries :as cq]
            [clj-time.format :as format]
            [clj-time.coerce :as coerce])
  (:use [noir.core]))

(defpage "/coge-user-list" []
  (nr/json {:user-list (cq/coge-user-list)}))

(defpage "/coge-comment-list" []
  (nr/json {:user-list (cq/coge-comment-list)}))
