package com.photoshare.api.service;

import com.photoshare.api.model.Comment;
import com.photoshare.api.model.Post;
import com.photoshare.api.repository.CommentRepository;
import com.photoshare.api.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public Optional<Comment> getCommentById(String id) {
        return commentRepository.findById(id);
    }

    public Comment createComment(Comment comment) {
        comment.setCreatedAt(new Date());
        comment.setUpdatedAt(new Date());
        
        // Update post comment count
        Optional<Post> optionalPost = postRepository.findById(comment.getPostId());
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setCommentsCount(post.getCommentsCount() + 1);
            postRepository.save(post);
        }
        
        return commentRepository.save(comment);
    }

    public Comment updateComment(String id, Comment commentDetails) {
        Optional<Comment> optionalComment = commentRepository.findById(id);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            comment.setContent(commentDetails.getContent());
            comment.setUpdatedAt(new Date());
            return commentRepository.save(comment);
        }
        return null;
    }

    public boolean deleteComment(String id) {
        Optional<Comment> optionalComment = commentRepository.findById(id);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            
            // Update post comment count
            Optional<Post> optionalPost = postRepository.findById(comment.getPostId());
            if (optionalPost.isPresent()) {
                Post post = optionalPost.get();
                post.setCommentsCount(Math.max(0, post.getCommentsCount() - 1));
                postRepository.save(post);
            }
            
            commentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void deleteCommentsByPostId(String postId) {
        commentRepository.deleteByPostId(postId);
    }
}
