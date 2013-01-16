(ns greentea.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.page]
        [hiccup.element]))

(defpartial global [title]
  [:head
    [:title (str "CoGe Analytics - " title)]
    (include-css
      "/css/reset.css"
      "/css/style.css")
    (include-js
      "//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"
      "//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js")])


(defpartial wrapper [& content]
  [:div#wrapper
    (image {:id "logo" :alt "CoGe Logo"} "/img/logo.png")
    [:br]
    content]
  [:br])

(defpartial header []
  [:div#header])

(defpartial footer []
  [:div#footer])

(defpartial page [& content]
  (header)
  (wrapper content)
  (footer))

(defpartial graph-page [& content]
  (html5
    [:head
      (global "Graph - by Day")
      (include-js "/js/lib/spin.min.js"
                  "/js/spinner.js")
      (javascript-tag "$(document).ready(function(){
                       $('#graphs').addClass('active');});")]
    [:body
      {:onload "createChart()"}
      (page
        [:h3
          [:select#type.selector {:onchange "reloadChart()"}
            [:option  {:data ""} "All"]
            [:option {:data "SynMap"} "SynMap"]
            [:option {:data "SynFind"} "SynFind"]
            [:option {:data "GeVo"} "GeVo"]
            [:option {:data "CoGeBlast"} "CoGeBlast"]
            [:option {:data "user"} "User Additions"]
            [:option {:data "organismview"} "OrganismView"]

]
        "CoGe Apps Over Time"]
        [:br]
        [:div#chart]
        [:div#loader]
        content
        [:h5.right "Data Starting from: " [:span#firstDate]])
      (include-js "/js/lib/amcharts.js"
                  "/js/lib/underscore-min.js")]))

(defpartial day-page []
  (include-js "/js/day-graph.js")
  (javascript-tag "$('#day').addClass('active')"))

(defpartial raw-page [& content]
  (html5
    [:head
      (global "Raw Data")]
    [:body
      (page content)]))
