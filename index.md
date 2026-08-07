---
layout: splash
title: "Data Structures and Algorithms Spring 2026"
header:
  overlay_color: "#000"
  overlay_filter: "0.4"
---

{% include search-box.html %}

## How-tos


* [Get set with Kotlin](how_to/setting_up_kotlin)
* [Useful Resources](how_to/useful_resources) (please let me know what I should add to this list).
* [Git Setup](how_to/git_setup)

## In-class Activities

[Sample solutions for in-class assignments](https://github.com/OlinDSA2026/SampleSolutions) will be made available on GitHub.

| Day # | Activity                                                                      |
|-------|-------------------------------------------------------------------------------|
{% for d in (1..1) %}
{%- assign dd = d -%}
{%- if d < 10 -%}{% assign dd = '0' | append: d %}{% endif -%}
{%- assign fname = 'in_class/day' | append: dd | append: '.md' -%}
{%- assign p = site.pages | where: "path", fname | first -%}

{% if p and p.published != false -%}
{%- comment -%} Build prefixes to remove from the start of the title {%- endcomment -%}
{%- capture pref1 %}Day {{ d }}:{% endcapture -%}
{%- capture pref1s %}Day {{ d }}: {% endcapture -%}
{%- capture pref2 %}Day {{ dd }}:{% endcapture -%}
{%- capture pref2s %}Day {{ dd }}: {% endcapture -%}
{%- assign t = p.title | default: p.url -%}
{%- assign t = t | replace_first: pref1s, '' | replace_first: pref1, '' -%}
{%- assign t = t | replace_first: pref2s, '' | replace_first: pref2, '' -%}
{%- assign clean_title = t | strip -%}
| {{ d }} | [{{ clean_title }}]({{ p.url | relative_url }}) |
{%- endif %}
{% endfor %}

##  Assignments

| Due at beginning of class # | Assignment |
|-------|------------|
{% for d in (1..10) %}
{%- assign dd = d -%}
{%- if d < 10 -%}{% assign dd = '0' | append: d %}{% endif -%}
{%- assign fname = 'assignments/assignment_' | append: dd | append: '.md' -%}
{%- assign p = site.pages | where: "path", fname | first -%}

{% if p and p.published != false -%}
{%- comment -%} Build prefixes to remove from the start of the title {%- endcomment -%}
{%- capture pref1 %}Assignment {{ d }}:{% endcapture -%}
{%- capture pref1s %}Assignment {{ d }}: {% endcapture -%}
{%- capture pref2 %}Assignment {{ dd }}:{% endcapture -%}
{%- capture pref2s %}Assignment {{ dd }}: {% endcapture -%}
{%- assign t = p.title | default: p.url -%}
{%- assign t = t | replace_first: pref1s, '' | replace_first: pref1, '' -%}
{%- assign t = t | replace_first: pref2s, '' | replace_first: pref2, '' -%}
{%- assign clean_title = t | strip -%}
| {{ p.due_on_class }} | [{{ clean_title }}]({{ p.url | relative_url }}) |
{%- endif %}
{% endfor %}

<!--

## Oral Quiz Practice Problems

* [Quiz 1 Practice](assignments/oralquizpractice_01) ([Quiz 1](assignments/oralquiz_01))

-->
