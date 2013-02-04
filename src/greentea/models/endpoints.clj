(ns greentea.models.endpoints
  (:require [noir.response :as nr]
            [greentea.models.queries :as cq]
            [greentea.models.mutators :as mu])
  (:use [noir.core]))

(defpage "/get-log-user" []
  (nr/json (cq/coge-log-user-data)))

(defpage "/get-log-comment" []
  (nr/json (cq/coge-log-comment-data)))

(defpage "/get-log-all" []
  (nr/json (cq/coge-log-all-data)))

(defpage "/get-log-jobs/:type" {:keys [type]}
  (nr/json (cq/jobs-data type)))

(defpage "/get-log-jobs/" []
  (nr/json (cq/jobs-data nil)))

(defpage "/get-log-jobs-day/:type" {:keys [type]}
  (nr/json (mu/group-by-day type)))

(defpage "/get-log-jobs-day/" []
  (nr/json (mu/group-by-day nil)))

(defpage "/get-log-jobs-accumulated/:type" {:keys [type]}
  (nr/json (mu/accumulate-by-day type)))

(defpage "/get-log-jobs-accumulated/" []
  (nr/json (mu/accumulate-by-day nil)))
