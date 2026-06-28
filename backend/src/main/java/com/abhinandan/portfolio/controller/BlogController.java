package com.abhinandan.portfolio.controller;

import com.abhinandan.portfolio.model.Blog;
import com.abhinandan.portfolio.repository.BlogRepository;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blogs")
@CrossOrigin(origins = "*")
public class BlogController {

    private final BlogRepository blogRepository;

    public BlogController(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    @GetMapping
    @Cacheable(value = "blogs")
    public List<Blog> getPublishedBlogs() {
        return blogRepository.findByPublishedTrueOrderByCreatedAtDesc();
    }

    @GetMapping("/all")
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Blog> getBlogBySlug(@PathVariable String slug) {
        return blogRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @CacheEvict(value = "blogs", allEntries = true)
    public Blog createBlog(@Valid @RequestBody Blog blog) {
        return blogRepository.save(blog);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "blogs", allEntries = true)
    public ResponseEntity<Blog> updateBlog(@PathVariable Long id, @Valid @RequestBody Blog blogDetails) {
        return blogRepository.findById(id)
                .map(blog -> {
                    blog.setTitle(blogDetails.getTitle());
                    blog.setSlug(blogDetails.getSlug());
                    blog.setContent(blogDetails.getContent());
                    blog.setSummary(blogDetails.getSummary());
                    blog.setPublished(blogDetails.getPublished());
                    blog.setTags(blogDetails.getTags());
                    blog.setCategories(blogDetails.getCategories());
                    return ResponseEntity.ok(blogRepository.save(blog));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "blogs", allEntries = true)
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(blog -> {
                    blogRepository.delete(blog);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
