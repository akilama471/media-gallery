import { Tag } from '../../src/types/models';
import { tagModel } from '../models/tag.model';

export class TagService {
  public getAllTags(): Tag[] {
    return tagModel.getAll();
  }

  public getOrCreateTag(name: string): Tag {
    const cleanName = name.trim();
    if (!cleanName) throw new Error('Tag name cannot be empty');
    
    let tag = tagModel.findByName(cleanName);
    if (!tag) {
      tag = tagModel.create(cleanName);
    }
    return tag;
  }

  public renameTag(id: number, newName: string): Tag {
    const cleanName = newName.trim();
    if (!cleanName) throw new Error('Tag name cannot be empty');
    
    const existing = tagModel.findByName(cleanName);
    if (existing && existing.id !== id) {
      throw new Error('A tag with this name already exists');
    }
    
    tagModel.update(id, cleanName);
    return tagModel.findById(id)!;
  }

  public deleteTag(id: number): void {
    tagModel.delete(id);
  }

  public getTagsForBookmark(bookmarkId: number): Tag[] {
    return tagModel.getTagsForBookmark(bookmarkId);
  }

  public setTagsForBookmark(bookmarkId: number, tagNames: string[]): Tag[] {
    const tagIds = tagNames.map(name => this.getOrCreateTag(name).id);
    tagModel.setTagsForBookmark(bookmarkId, tagIds);
    return tagModel.getTagsForBookmark(bookmarkId);
  }
  
  public getBookmarkIdsForTag(tagId: number): number[] {
    return tagModel.getBookmarkIdsForTag(tagId);
  }
}

export const tagService = new TagService();
