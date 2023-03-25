---
title: Migrating this Blog to Eleventy
description: How I went about migrating this blog from Jekyll to Eleventy.
date: 2023-03-25
image: migrating-to-11ty.png
permalink: /work/migrating-this-blog-to-eleventy/
---

I recently decided to update my website after neglecting it for over 8 years. I wanted to give it a refresh and make it more modern and appealing. After a quick search, I chose [Eleventy](https://11ty.dev) as my SSG. I like new SSGs that give me something interesting to learn. I've been sticking with Javascript for a while, only using Python for machine learning projects. Eleventy fits that description perfectly.

## Selecting a starter project

Once I chose Eleventy, the next step was to find a starter project to work with. Thankfully, Eleventy has a lot of starter projects available on their website. I selected one that gave me new things to learn. I hadn’t built anything with Tailwind CSS, so I went with one that used that framework. The starter project I chose was called "Eleventy Excellent" and can be found on GitHub at [https://github.com/madrilene/eleventy-excellent](https://github.com/madrilene/eleventy-excellent).

## Migrating old content

After I had my starter project set up, the next step was to add my old post content to it. Eleventy Excellent uses posts in `/src/posts`. I deleted everything from that directory and pasted in my old markdown files. I was using `.markdown` extensions and had to update that to `.md`. That was it. Migrated.

## Adding images

The starter project didn’t use images for the post previews. I wanted to add images to add colour to the blog. To quickly whip up some images I generated images using [OpenAI’s image generator DALL-E](https://labs.openai.com/). I plan to update the images with better ones once I get my own image pipeline working.

I moved the post summary card into an unused partial in the template and updated the layout in include the image. I added the image to the post page and moved the title header up to overlay the image. All super easy.

## Adding dark mode with ChatGPT

One of the features I wanted to add to my blog was a dark mode option. To achieve this, I used ChatGPT to write the code to make dark mode work and persist the user's choice. I followed the instructions, using the navigation left icon and name as the toggle. Here’s what ChatGPT said when asked for a way to add dark mode to a Tailwind site.

<div class="chatgpt">
<img src="/assets/images/chatgpt.svg" class="chatgpt-logo" alt="ChatGPT Logo" />

To add a dark mode switch to a Tailwind CSS site, you can follow these general steps:

1. Set up the basic HTML structure of your dark mode switch. This could be a simple button or a toggle switch. Make sure to give it a unique `id` or `class` so that you can target it with CSS and JavaScript.
2. Create a new CSS class to define the styles for your dark mode theme. You can use the Tailwind `dark:` variant to apply specific styles when the user has enabled dark mode. For example, you could define a class like this:
    
    ```css
    .dark-mode { 
    	background-color: #1a202c; color: #f7fafc;
    }
    /* Use the `dark:` variant to apply specific styles in dark mode */
    .dark-mode h1 { 
    	color: #fff;
    }
    ```
    
    This example defines a dark mode theme with a dark blue background color and light text. It also sets the text color of any `h1` elements to white.
    
3. Add a JavaScript event listener to your dark mode switch. This should listen for clicks on the switch and toggle a `dark-mode` class on the `body` element of your page. You can use the `classList` API to add or remove classes. Here's an example:
    
    ```jsx
    const darkModeToggle = document.querySelector('#dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => { 
    	document.body.classList.toggle('dark-mode');
    });
    ```
    
    This example listens for clicks on an element with the `id` of `dark-mode-toggle` and toggles the `dark-mode` class on the `body` element.
    
4. Test your dark mode switch to make sure it's working as expected. You can use the DevTools in your browser to inspect the styles being applied in both light and dark mode.

To keep the dark mode switch state consistent across page changes, you can use a combination of localStorage and JavaScript to store and retrieve the user's preference.

Here's an example of how to implement this:

1. In your JavaScript code, add a function that sets the `dark-mode` class on the `body` element based on the user's preference stored in localStorage. You can use the `localStorage.getItem()` method to retrieve the stored value.
    
    ```jsx
    function applyDarkModePreference() { 
    	const isDarkMode = localStorage.getItem('isDarkMode') === 'true'; 
    	if (isDarkMode) { 
    		document.body.classList.add('dark-mode'); 
    	} else { 
    		document.body.classList.remove('dark-mode'); 
    	}
    }
    ```
    
2. Call the `applyDarkModePreference()` function when your page loads to apply the user's preference.
    
    ```jsx
    window.addEventListener('load', applyDarkModePreference);
    ```
    
3. Modify your dark mode toggle event listener to update the user's preference in localStorage when the switch is toggled. You can use the `localStorage.setItem()` method to store the value.
    
    ```jsx
    const darkModeToggle = document.querySelector('#dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => { 
    	document.body.classList.toggle('dark-mode'); 
    	const isDarkMode = document.body.classList.contains('dark-mode'); 
    	localStorage.setItem('isDarkMode', isDarkMode);
    });
    ```
With these changes, the user's preference will be stored in localStorage and applied to the `body` element each time the page loads. When the user toggles the dark mode switch, the preference will be updated and stored in localStorage. This will keep the switch state consistent across page changes.
</div>

## Publishing pipeline

Finally, it was time to set up my publishing pipeline. I chose GitHub as my platform, and the good news was that it automatically publishes Jekyll. I set up a GitHub action to publish my site, which is triggered by a push to the master branch. The only thing I had to update was the source folder.

Eleventy was a great choice for me, and I had a lot of fun learning new things while working on my blog. With a little bit of setup, I was able to get my blog up and running with the features I wanted. I'm excited to continue learning and improving my blog in the future.