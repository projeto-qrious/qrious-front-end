<!-- <motion.div
                  layout
                  className="space-y-4 max-h-[400px] overflow-y-auto"
                >
                  <AnimatePresence>
                    {sortedQuestions.length > 0 ? (
                      sortedQuestions.map((question, index) => (
                        <motion.div
                          key={question.id}
                          layoutId={question.id}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{
                            duration: 0.5,
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          style={{
                            zIndex: sortedQuestions.length - index,
                          }}
                        >
                          <Link
                            href={`/sessions/${sessionId}/questions/${question.id}`}
                          >
                            <Card className="bg-gray-50 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300">
                              <CardContent className="p-4">
                                <p className="text-lg mb-2 text-gray-800 line-clamp-3 break-words">
                                  {question.text}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                                  <span className="flex items-center">
                                    <User className="w-4 h-4 mr-1 flex-shrink-0" />
                                    <span className="truncate max-w-[200px]">
                                      {question.createdBy}
                                    </span>
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={`flex items-center space-x-1 ${
                                      question.votes &&
                                      userId &&
                                      question.votes[userId]
                                        ? "bg-[#9e49ff] text-white"
                                        : "text-[#560bad] hover:bg-[#560bad] hover:text-white"
                                    } transition-colors duration-300`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleVote(question.id);
                                    }}
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>
                                      {question.votes
                                        ? Object.keys(question.votes).length
                                        : 0}
                                    </span>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div> -->
