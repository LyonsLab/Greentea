(ns greentea.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.page]
        [hiccup.element]))

(defpartial global [title]
  [:head
    [:title (str "CoGe Analytics - " title)]
    (include-css
      "css/reset.css"
      "css/chosen.css"
      "css/style.css"
      "css/jquery-ui-1.10.1.custom.min.css"
      "//fonts.googleapis.com/css?family=Open+Sans:400,600,800")
    (include-js
      "js/lib/jquery-1.9.1.min.js"
      "js/lib/jquery-ui-1.10.1.custom.min.js"
)])

(defpartial wrapper [& content]
  [:div#wrapper content])

(defpartial header []
  [:div#header])

(defpartial footer []
  [:div#footer])

(defpartial page [& content]
  (header)
  (wrapper content)
  (footer))


(defpartial graph-nav []
  [:div#graph-nav
    [:span.nav]
    [:a#day.nav
      {:onclick "toggleGraphs(this)"
      :href "#"}
      [:li.nav "Day"]]
    [:span.nav]
    [:a#accumulated.nav
      {:onclick "toggleGraphs(this)"
      :href "#"}
      [:li.nav "Accumulated"]]
    [:span.nav]])

(defpartial select-box []
  [:select#select.chzn-select
    {:onchange "selectChart();"
      :data-placeholder "Choose a CoGe Page"}
    [:option {:data ""} ""]
    [:option {:data ""} "Main Four Jobs"]
    [:option {:data "synmap"} "SynMap"]
    [:option {:data "synfind"} "SynFind"]
    [:option {:data "gevo"} "GEvo"]
    [:option {:data "cogeblast"} "CoGeBlast"]
    [:option {:data "featview"} "FeatView"]
    [:option {:data "organismview"} "OrganismView"]
    [:option {:data "user"} "User Additions"]])

(defpartial search-box []
  [:span "Search:"
    [:input#search
      {:oninput "autoComplete()"}]])

(defpartial graph-page [& content]
  (html5
    [:head
      (global "Graph - by Day")
      (include-js "js/lib/spin.min.js"
                  "js/spinner.js")]
    [:body
      {:onload "init()"}
      (page
        [:div#outer
          [:div#side-nav
            (image {:id "logo" :alt "CoGe Logo"}
              "img/logo.png")
            [:br][:br]
            (search-box)
            [:br][:br]
            (select-box)
          ]
          [:div#inner
            (graph-nav)
            [:div#chart {:onMousewheel "event.preventDefault(); handle(event)"}]
            [:div#chart-bottom
              [:div#controls
                [:input#rb1
                  {:type "radio" :name "dayGroup" :onChange "setPanSelect()"}
                    "Select&nbsp&nbsp"]
                [:input#rb2
                  {:type "radio" :checked "true"
                  :name "dayGroup" :onChange "setPanSelect()"} "Pan"]]
              [:h5#starting "Data Starting from: " [:span#firstDate]]]]
          content
          [:div#loader]])
      (javascript-tag "$(document).ready(function(){
                        $('.chzn-select').chosen({
                          no_results_text: 'No results matched'
                        });
                      })")
      (include-js "js/lib/chosen.jquery.min.js"
                  "js/lib/mousetrap.min.js"
                  "js/lib/amcharts.js"
                  "js/lib/underscore-min.js"
                  "js/graph-script.js"
                  "js/select-script.js"
                  "js/autocomplete-script.js"
                  "js/keybindings.js"
                  "js/mousewheel-script.js")]))

(defpartial day-page []
  (javascript-tag "$('#day').addClass('active')"))

(defpartial raw-page [& content]
  (html5
    [:head
      (global "Raw Data")]
    [:body
      (page content)]))
