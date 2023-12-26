"use client";
import React, { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => {
        return (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        );
      })}
    </div>
  );
};

const Feed = () => {
  //search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const [posts, setPosts] = useState([]);



  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts=(searchText)=>{
    const regex = new RegExp(searchText, "i");
    //i flag for case insensitive search

    return posts.filter((item)=> regex.test(item.prompt)|| regex.test(item.tag)|| regex.test(item.creator.username))
  }

  const handleSearchChange=(e)=>{
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    //debounce method

    setSearchTimeout(
      setTimeout(() => {
       const searchResult = filterPrompts(e.target.value);
       setSearchResults(searchResult);
      }, 500)
    );
  }


 const handleTagClick = (tagName) => {
  setSearchText(tagName);

  const searchResult = filterPrompts(tagName);
  setSearchResults(searchResult);
 }


  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          text="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {searchText?(
        <PromptCardList
          data={searchResults}
          handleTagClick={handleTagClick}
        />
      ):(
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
