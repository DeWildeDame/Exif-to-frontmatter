# Exif-to-frontmatter

Simple exif data parser that ouputs yaml front matter, 
there are probably more robus options out there, not the point of this library. It was mainly to get some ideas out of my head. 

I will be using this tool for my website as my Obsidian notebook. 
It serves as a quick and dirty method to create scaffolding from images from my camera if present. 


## To run this tool:

```
pnpm i
pnpn build
node ./dist/cli.js <photo or folder>
```


If no arguments are selected the directory ```'input'``` is assumed as the folder you want to process. Recursion in the input directory is safehuarded. 

## Overrides

If you need to obfuscate or pre-populate. I will be using this primarily for photos taken on an film camera or when I have been using vintage lenses. 

```--title "My custom title" --iso 800```


