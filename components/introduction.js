"use strict";

export default function Welcome() {
  let inner = `<div class="welcome">
  <div class="row">
    <div class="intro col-8">
      <h1 class="center">Human impact on the environment</h1>
      <span class="center">Andy, Dex, Matt</span>
    </div>
    <img
      class="lazy-loaded lazyloaded welcome-img"
      src="https://visme.co/blog/wp-content/uploads/climate-change-facts-header-wide.gif"
      data-src="https://visme.co/blog/wp-content/uploads/climate-change-facts-header-wide.gif"
      alt="The Best Data Viz and Infographics on Climate Change Facts"
    />
  </div>
  <div class="center">
    <p class="center intro-desc">
      Human activity has had an effect on the environment for thousands
      of years, from the time of our very earliest ancestors. Since Homo
      sapiens first walked the earth, we have been modifying the
      environment around us through agriculture, travel and eventually
      through urbanization and commercial networks. At this point in
      earth’s physical history, our impact on the environment is so
      substantial that scientists believe “pristine nature,” or
      ecosystems untouched by human intervention, no longer exist.
    </p>
  </div>
  <div class="center">
    <p class="center intro-desc">
      Humans impact the physical environment in many ways:
      overpopulation, pollution, burning fossil fuels, and
      deforestation. Changes like these have triggered climate change,
      soil erosion, poor air quality, and rising sea levels. These
      negative impacts can affect human behavior and can prompt mass
      migrations or battles over clean water.
    </p>
  </div>
</div>`;
  return inner;
}
