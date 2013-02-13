(ns greentea.views.pages
  (:require [greentea.views.common :as template]
            [noir.response :as nr]
            [clojure.string :as string]
            [greentea.models.queries :as cq])
  (:use [noir.core]
        [greentea.db]
        [greentea.models.endpoints]
        [hiccup.element]))

(defpage "/" []
  (render "/graph"))

(defpage "/graph" []
  (template/graph-page
    (template/day-page)))
