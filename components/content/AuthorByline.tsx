import type { ContentAuthor } from "@/lib/types";
import Image from "next/image";

export default function AuthorByline({ author }: { author: ContentAuthor }) {
  return (
    <div className="ct-byline">
      {author.avatar && (
        <Image
          src={author.avatar}
          alt={author.name}
          width={36}
          height={36}
          className="ct-byline-avatar"
        />
      )}
      <div>
        <span className="ct-byline-name">{author.name}</span>
        {author.credentials && (
          <span className="ct-byline-creds">{author.credentials}</span>
        )}
      </div>
    </div>
  );
}
