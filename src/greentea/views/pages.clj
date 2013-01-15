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
  (render "/graph/day"))

(defpage "/graph/day" []
  (template/graph-page
    [:div.select
      [:input#rb1
        {:type "radio" :name "dayGroup" :onClick "setPanSelect()"}
          "Select&nbsp&nbsp"]
      [:input
        {:type "radio" :checked "true" :name "dayGroup" :onClick "setPanSelect()"}
          "Pan"]]
    (template/day-page)))
