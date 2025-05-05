package com.photoshare.api.service;

import com.photoshare.api.model.Community;
import com.photoshare.api.repository.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    @Autowired
    private CommunityRepository communityRepository;

    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Optional<Community> getCommunityById(String id) {
        return communityRepository.findById(id);
    }

    public Optional<Community> getCommunityByName(String name) {
        return communityRepository.findByName(name);
    }

    public Community createCommunity(Community community) {
        community.setCreatedAt(new Date());
        community.setUpdatedAt(new Date());
        community.getMembers().add(community.getCreatorId()); // Add creator as a member
        community.setMemberCount(1);
        return communityRepository.save(community);
    }

    public Community updateCommunity(String id, Community communityDetails) {
        Optional<Community> optionalCommunity = communityRepository.findById(id);
        if (optionalCommunity.isPresent()) {
            Community community = optionalCommunity.get();
            community.setName(communityDetails.getName());
            community.setDescription(communityDetails.getDescription());
            community.setTags(communityDetails.getTags());
            community.setCoverImage(communityDetails.getCoverImage());
            community.setUpdatedAt(new Date());
            return communityRepository.save(community);
        }
        return null;
    }

    public boolean deleteCommunity(String id) {
        if (communityRepository.existsById(id)) {
            communityRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean joinCommunity(String communityId, String userId) {
        Optional<Community> optionalCommunity = communityRepository.findById(communityId);
        if (optionalCommunity.isPresent()) {
            Community community = optionalCommunity.get();
            if (!community.getMembers().contains(userId)) {
                community.getMembers().add(userId);
                community.setMemberCount(community.getMemberCount() + 1);
                communityRepository.save(community);
                return true;
            }
        }
        return false;
    }

    public boolean leaveCommunity(String communityId, String userId) {
        Optional<Community> optionalCommunity = communityRepository.findById(communityId);
        if (optionalCommunity.isPresent()) {
            Community community = optionalCommunity.get();
            if (community.getMembers().contains(userId)) {
                community.getMembers().remove(userId);
                community.setMemberCount(Math.max(0, community.getMemberCount() - 1));
                communityRepository.save(community);
                return true;
            }
        }
        return false;
    }

    public List<Community> searchCommunitiesByTag(String tag) {
        return communityRepository.findByTags(tag);
    }

    public List<Community> searchCommunitiesByName(String name) {
        return communityRepository.findByNameContaining(name);
    }

    public List<Community> getUserCommunities(String userId) {
        return communityRepository.findByMemberId(userId);
    }

    public void incrementPostCount(String communityId) {
        Optional<Community> optionalCommunity = communityRepository.findById(communityId);
        if (optionalCommunity.isPresent()) {
            Community community = optionalCommunity.get();
            community.setPostCount(community.getPostCount() + 1);
            communityRepository.save(community);
        }
    }

    public void decrementPostCount(String communityId) {
        Optional<Community> optionalCommunity = communityRepository.findById(communityId);
        if (optionalCommunity.isPresent()) {
            Community community = optionalCommunity.get();
            community.setPostCount(Math.max(0, community.getPostCount() - 1));
            communityRepository.save(community);
        }
    }
}
