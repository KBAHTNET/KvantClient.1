<template>
  <div class="blog-card">
    <div class="title-content">
      <h5>
        <a href="#">{{ getTitle }}</a>
      </h5>
      <div class="intro">
        <a href="#">{{ getBody }}</a>
      </div>
    </div>
    <div class="card-info">
      <aaa @click="$router.push('/posts/' + id)">Подробнее... ></aaa>
    </div>
    <div class="utility-info">
      <ul class="utility-list">
        <li>
          <span class="licon icon-like"></span><a href="#">{{ getLikes }}</a>
        </li>
        <li>
          <span class="licon icon-com"></span><a href="#">{{ getComments }}</a>
        </li>
        <li><span class="licon icon-dat"></span>{{ date }}</li>
      </ul>
    </div>
    <div class="gradient-overlay"></div>
    <div class="color-overlay"></div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    intro: {
      type: String,
      default: "",
    },
    body: {
      type: String,
      default: "М",
    },
    preview: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    getBody() {
      if (this.body.length > 120) {
        return this.body.slice(0, 120) + "...";
      } else {
        return this.body;
      }
    },
    getTitle() {
      if (this.title.length > 40) {
        return this.title.slice(0, 40) + "...";
      } else {
        return this.title;
      }
    },
    getLikes() {
      try {
        if (typeof this.likes === "object" && this.likes.length > 0) {
          return this.likes.length;
        } else {
          return 0;
        }
      } catch {
        return 0;
      }
    },
    getComments() {
      try {
        if (typeof this.comments === "object" && this.comments.length > 0) {
          return this.comments.length;
        } else {
          return 0;
        }
      } catch {
        return 0;
      }
    },
  },
  mounted() {
    this.$el.style.background = "url(" + this.preview + ") center no-repeat";
  },
};
</script>

<style scoped>
.blog-card {
  background-color: var(--theme-color);

  max-width: 550px;
  width: 100%;
  height: 500px;
  position: relative;
  font-family: "Droid Serif", serif;
  color: #fff;
  top: 0;
  right: 0;
  left: 0;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 0px;
  box-shadow: 0px 10px 20px -9px rgba(0, 0, 0, 0.5);
  text-align: center;
  transition: all 0.4s;
  background-size: cover !important;
  aspect-ratio: 1/1;
}
.blog-card a {
  color: #fff;
  text-decoration: none;
  transition: all 0.2s;
}
.blog-card .color-overlay {
  background: rgba(64, 84, 94, 0.3);
  width: 550px;
  height: 500px;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  transition: background 0.3s cubic-bezier(0.33, 0.66, 0.66, 1);
}
.blog-card .gradient-overlay {
  background-image: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.6) 21%);
  width: 550px;
  height: 500px;
  position: absolute;
  top: 350px;
  left: 0;
  z-index: 1;
}
.blog-card:hover {
  box-shadow: 0px 18px 20px -9px rgba(0, 10, 30, 0.75);
}
.blog-card:hover .card-info {
  opacity: 1;
  bottom: 100px;
}
.blog-card:hover .color-overlay {
  background: rgba(0, 0, 0, 0.8);
}
.blog-card:hover .title-content {
  margin-top: 70px;
}
.title-content {
  text-align: center;
  margin: 170px 0 0 0;
  position: absolute;
  z-index: 2;
  width: 100%;
  top: 0;
  left: 0;
  transition: all 0.6s;
}

.blog-card:hover h5:after {
  animation: changeLetter 0.3s 1 linear;
  width: 80%;
}

.blog-card h5,
h1 {
  font-size: 24px;
  letter-spacing: 1px;
  font-family: "Abril Fatface", serif;
  margin-bottom: 0;
  display: inline-block;
  word-break: break-word;
}
.blog-card h5 a {
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.2s;
}
.blog-card h5 a:hover {
  text-shadow: 0px 8px 20px rgba(0, 0, 0, 0.95);
}
h5:after {
  content: " ";
  display: block;
  width: 10%;
  height: 2px;
  margin: 20px auto;
  border: 0;
  background: var(--primary-color);
  transition: all 0.2s;
}

@keyframes changeLetter {
  0% {
    width: 10%;
  }
  100% {
    width: 80%;
  }
}

.intro {
  min-width: 170px;
  max-width: 90%;
  margin: 0 auto;
  color: #ddd;
  line-height: 18px;

  word-wrap: break-word;
}
.intro a {
  color: #ddd;
}
.intro a:hover {
  text-decoration: underline;
}
.card-info {
  box-sizing: border-box;
  padding: 0;
  width: 100%;
  position: absolute;
  bottom: -40px;
  left: 0;
  margin: 0 auto;
  padding: 0 50px;
  font-style: 16px;
  line-height: 24px;
  z-index: 2;
  opacity: 0;
  transition: bottom 0.64s, opacity 0.63s cubic-bezier(0.33, 0.66, 0.66, 1);

  cursor: pointer;
}

.card-info aaa {
  display: block;
  width: 100px;
  margin: 15px auto;
  background: #fff;
  color: #444;
  padding: 3px 10px;
  border-radius: 2px;
  font-size: 0.8em;
}
.card-info aaa:hover {
  background: var(--primary-color);
  color: #fff;
}
.card-info aaa:hover span {
  filter: brightness(10);
  opacity: 1;
}
.utility-info {
  position: absolute;
  bottom: 0px;
  left: 0;
  z-index: 2;
  width: 100%;
  text-align: left;
}
.utility-info:after {
  content: " ";
  background: url(/icons/icons.svg) center no-repeat;
  background-size: 30px auto;
  display: block;
  opacity: 0.4;
  position: absolute;
  bottom: 25px;
  right: 15px;
  width: 30px;
  height: 15px;
}
.utility-info a:hover {
  text-decoration: underline;
}
.utility-list {
  list-style-type: none;
  margin: 0 0 10px 20px;
  padding: 0;
  width: 100%;
}
.utility-list li {
  margin: 0 5px 0 0;
  padding: 3px 0 15px 0px;
  display: inline-block;

  font-size: 0.8em;
}

.licon {
  position: relative;
  width: 23px;
  height: 15px;
  display: inline-block;
  vertical-align: middle;
}
.licon:before {
  content: "";
  background: url(/icons/icons.svg) -2px -6px no-repeat;
  background-size: 250px;
  width: 26px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  position: absolute;
  top: -3px;
  left: 0;
}
.icon-white {
  filter: brightness(10);
}
.icon-black {
  filter: brightness(0);
  opacity: 0.6;
}
.icon-like:before {
  background-position: -183px -6px;
}
.icon-com:before {
  background-position: -63px -4px;
}
.icon-dat:before {
  background-position: -94px -7px;
}
.icon-tag:before {
  background-position: -33px -6px;
}

@media (max-width: 750px) {
  .utility-info {
    text-align: center;
  }
  .utility-info ul {
    width: 100%;
    margin: 0;
    box-sizing: border-box;
  }
  .utility-info li {
    width: 49%;
    display: inline-block;
    box-sizing: border-box;
    margin: 0;
  }
}

@media (max-width: 500px) {
  .utility-info li:last-of-type {
    width: 100%;
  }
  .card-info {
    display: none;
  }
  .blog-card:hover .title-content,
  .title-content {
    margin-top: 40px;
  }
  .blog-card {
    height: 300px;
  }
  .blog-card h5 {
    font-size: 1.3em;
  }
  .intro {
    font-size: 0.8em;
  }
}

aaa{
  cursor: pointer;
}
</style>