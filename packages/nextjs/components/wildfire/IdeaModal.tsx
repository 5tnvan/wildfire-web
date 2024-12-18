import React, { useRef, useState } from "react";
import { Avatar } from "../Avatar";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useOutsideClick } from "~~/hooks/scaffold-eth/useOutsideClick";
import { insertIdea } from "~~/utils/wildfire/crud/idea";
import { insertIdeaTag } from "~~/utils/wildfire/crud/idea_tags";
import { fetchTag, insertTag } from "~~/utils/wildfire/crud/tags";
import IdeaSuccessModal from "./IdeaSuccessModal";

const IdeaModal = ({ data, onClose }: { data: any; onClose: () => void }) => {
  const [textInput, setTextInput] = useState("");
  const insideRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sparkId, setSparkId] = useState<any>(null);

  useOutsideClick(insideRef, () => {
    handleClose();
  });

  const handleClose = () => {
    onClose();
  };

  const handlePost = async () => {
    try {
      setLoading(true);
      const cleanUpText = convertToPlainText(textInput);

      // Check if text exceeds 280 characters
      if (cleanUpText.length > 280) {
        alert("Your post exceeds the 280-character limit. Please shorten it.");
        return;
      }

      const hashtags = extractHashtags(cleanUpText);
      const newIdea = await insertIdea(cleanUpText);

      if (newIdea && newIdea.length > 0 && hashtags.length > 0) {
        await saveTags(hashtags, newIdea);
      }

      setTextInput("");
      //router.push("/spark/" + newIdea);
      setSparkId(newIdea);
      setLoading(false);
    } catch (error) {
      console.error("Error saving idea:", error);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setTextInput(html);
  };

  const formatText = (text: string) => {
    return text
      .replace(/@(\w+)/g, `<span class="text-blue-500 font-bold">@$1</span>`) // Highlight mentions
      .replace(/#(\w+)/g, '<span class="text-secondary font-bold">#$1</span>'); // Highlight hashtags
  };

  const saveTags = async (hashtags: string[], idea_id: any) => {
    try {
      const promises = hashtags.map(async tag => {
        const tagName = tag.startsWith("#") ? tag.slice(1) : tag; // remove #

        // Check if the tag exists
        let tagId;
        const existingTag = await fetchTag(tagName);
        if (existingTag && existingTag.length > 0) {
          tagId = existingTag; // Assuming the first result is the tag ID
        } else {
          // If tag doesn't exist, insert it
          const newTag = await insertTag(tagName);
          tagId = newTag; // Assuming the insertTag function returns the new tag's ID
        }

        if (idea_id && tagId) await insertIdeaTag(idea_id, tagId);
      });

      // Wait for all tag processing to complete
      await Promise.all(promises);
    } catch (error) {
      console.error("Error saving tags:", error);
    }
  };

  const applyFormatting = (e: React.FormEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const text = element.innerText;
    const formattedHTML = formatText(text);
    element.innerHTML = formattedHTML;
    placeCaretAtEnd(element);
  };

  const placeCaretAtEnd = (el: HTMLElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const extractHashtags = (text: string): string[] => {
    const matches = text.match(/#\w+/g); // Match all hashtags
    return matches ? matches.map(tag => tag.slice(1)) : []; // Remove the '#' symbol
  };

  const convertToPlainText = (html: string): string => {
    // Remove all HTML tags
    let text = html.replace(/<\/?[^>]+(>|$)/g, ""); // Matches and removes all HTML tags
    
    // Remove span tags around @mentions and #hashtags, accounting for trailing punctuation
    text = text
      .replace(/<span class="[^"]*">(@\w+[^\s]*)<\/span>/g, "$1") // Remove span tags around mentions with trailing punctuation
      .replace(/<span class="[^"]*">(#\w+[^\s]*)<\/span>/g, "$1"); // Remove span tags around hashtags with trailing punctuation
    
    return text;
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div ref={insideRef} className="content rounded-lg bg-base-200 w-full md:w-1/2 h-2/3 overflow-scroll relative">
        {sparkId && <IdeaSuccessModal data={sparkId} onClose={handleClose} />}
        <div className="flex flex-col h-full gap-2 p-4">
          {/* Close Button */}
          <button className="w-fit" onClick={handleClose}>
            <XMarkIcon width={30} height={30} />
          </button>

          {/* Editable Area */}
          <div className="flex flex-row grow">
            <div className="w-12 h-12 mr-1">
              <Avatar profile={data.profile} width={12} height={12} />
            </div>
            <div
              className={`w-full placeholder:text-slate-400 text-2xl bg-base-200 m-2 rounded outline-none ${
                !textInput ? "placeholder" : ""
              }`}              
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyUp={applyFormatting}
              style={{ whiteSpace: "pre-wrap" }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              {!isFocused && !textInput && <span className="absolute text-gray-400">What's on your mind?</span>}
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex flex-row justify-between border-opacity-40 item-center pt-4 w-full"
            style={{ borderTop: "1px solid" }}
          >
            <div></div>
            <div className="btn btn-primary" onClick={handlePost}>
              Post Now
              {loading ? <span className="absolute loading loading-ring loading-md ml-1 right-4"></span> : <SparklesIcon width={15} height={15} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaModal;
