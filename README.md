# Exif-to-frontmatter

Simple exif data parser that ouputs yaml front matter, 
there are probably more robus options out there, not the point of this library. It was mainly to get some ideas out of my head. 

I will be using this tool for my website as my Obsidian notebook. 



To run this tool:

```
pnpm i
pnpn build
node ./dist/cli.js <photo or folder>
```


If no arguments are selected the directory ```'input'``` is assumed as the folder you want to process. Recursion in the input directory is safehuarded. 
